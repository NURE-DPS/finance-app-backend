import { Router } from 'express';
import { verifyAuth } from './auth.middleware';
import type { AuthenticatedRequest } from '@src/types/AuthenticatedRequest';
import { UserRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';

const router = Router();
const userRepository = new UserRepository();
const controller = new AuthController(userRepository);

router.post('/signup', controller.signUp);
router.post('/signin', controller.signIn);
router.get('/validate-token', verifyAuth, (req, res) => {
  res
    .status(200)
    .json({ valid: true, user: (req as AuthenticatedRequest).user });
});
router.get('/protected', verifyAuth, (req, res) => {
  res.json({
    message: 'You are authenticated',
    user: (req as AuthenticatedRequest).user,
  });
});

export { router as authRoutes };
