import supabase from '../../config/supabaseClient';
import { Request, Response } from 'express';
import express from 'express';

import { verifyAuth } from './auth.middleware';

export const signUp = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json({ message: 'Check your email for verification', data });
};

export const signIn = async (req: Request, res: Response): Promise<any> => {
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

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/protected', verifyAuth, (req, res, next) => {
  res.json({ message: 'You are authenticated', user: (req as any).user });
});

export default router;
