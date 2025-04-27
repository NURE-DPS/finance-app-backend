import supabase from '../../config/supabaseClient';
import { Request, Response } from 'express';

import { UserRepository } from '../user/user.repository';

export class AuthController {
  constructor(private userRepository: UserRepository) {}

  signUp = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
      const createdUser = this.userRepository.createOne({
        name: req.body.name,
        id: (data as any).user?.id,
        email: email,
      });
    } catch (err) {
      return res.status(400).json({message: 'Internal Server Error', err})
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
      return res.status(401).json({ error: error.message });
    }

    return res.json({ token: data.session?.access_token, user: data.user });
  };
}
