import { AuthenticatedRequest } from '@src/types/AuthenticatedRequest';
import supabase from '../../config/supabaseClient';
import { Request, Response, NextFunction } from 'express';

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer Token

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user)
    return res.status(401).json({ error: 'Invalid token' });

  if (!data.user.email || !data.user.id) {
    return res.status(401).json({ error: 'User data is incomplete' });
  }

  (req as any).user = {
    id: data.user.id,
  };

  next();
};
