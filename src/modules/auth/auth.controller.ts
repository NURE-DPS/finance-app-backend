import supabase from '../../config/supabaseClient';
import type { Request, Response } from 'express';

import type { UserRepository } from '../user/user.repository';

export class AuthController {
  constructor(private userRepository: UserRepository) {}

  signUp = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (
        error.message.includes('User already registered') ||
        error.message.includes('already exists')
      ) {
        return res
          .status(400)
          .json({ error: 'User already registered with such email.' });
      }

      return res.status(400).json({ error: 'Unable to create user.' });
    }

    try {
      await this.userRepository.createOne({
        name: req.body.name,
        id: (data as any).user?.id,
        email,
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        return res
          .status(400)
          .json({ error: 'User already registered with such email.' });
      }

      return res.status(500).json({ error: 'Internal server error.' });
    }

    return res.status(201).json({ message: 'User created', data });
  };

  signIn = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: 'Unable to log in user' });
    }

    return res.json({ token: data.session?.access_token, user: data.user });
  };

  googleAuth = async (req: Request, res: Response): Promise<any> => {
    console.log(req.body)
    const { token } = req.body;

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid token from Google OAuth' });
    }

    const user = data.user;

    try {
      let existingUser = await this.userRepository.findOne(user.id);

      if (!existingUser) {
        await this.userRepository.createOne({
          id: user.id,
          email: user.email!,
          name: user.user_metadata.full_name || 'Google User',
        });
      }

      return res.json({
        token,
        user,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Internal server error during Google OAuth' });
    }
  };
}

