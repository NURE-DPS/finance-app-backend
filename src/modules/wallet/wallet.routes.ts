import { Router } from 'express';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Request, Response } from 'express';
import prisma from '../../config/prismaClient';
import { validateBody } from '../../middleware/validateBody';
import { CREATE_WALLET_SCHEMA } from './wallet.types';

const router = Router();
const walletService = new WalletService(prisma);
const controller = new WalletController(walletService);

<<<<<<< Updated upstream
router.post(
  '/',
  validateBody(CREATE_WALLET_SCHEMA),
  (req: Request, res: Response) => {
    controller.create(req, res);
  }
);
=======
router.post('/', verifyAuth, validateBody(CREATE_WALLET_SCHEMA), (req, res) => {
  controller.create(req as AuthenticatedRequest, res);
});
router.get('/', verifyAuth, (req, res) => {
  controller.findAllWalletsByUser(req as AuthenticatedRequest, res);
});
>>>>>>> Stashed changes

export { router as walletRoutes };
