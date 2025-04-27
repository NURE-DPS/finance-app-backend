import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { Router } from 'express';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { validateBody } from '../../middleware/validateBody';
import { CREATE_WALLET_SCHEMA } from './wallet.types';
import { verifyAuth } from '../auth/auth.middleware';
import { WalletRepository } from './wallet.repository';

const router = Router();
const walletRepository = new WalletRepository();
const walletService = new WalletService(walletRepository);
const controller = new WalletController(walletService);

router.post('/', verifyAuth, validateBody(CREATE_WALLET_SCHEMA), (req, res) => {
  controller.create(req as AuthenticatedRequest, res);
});

export { router as walletRoutes };
