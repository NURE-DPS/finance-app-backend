import type { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { Router } from 'express';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { validateSchema } from '../../middleware/validateSchema';
import { CREATE_WALLET_SCHEMA } from './wallet.types';
import { verifyAuth } from '../auth/auth.middleware';
import { WalletRepository } from './wallet.repository';
import { asyncHandler } from '../../middleware/asyncHandler';

const router = Router();
const walletRepository = new WalletRepository();
const walletService = new WalletService(walletRepository);
const controller = new WalletController(walletService);

router
  .get(
    '/',
    verifyAuth,
    asyncHandler<AuthenticatedRequest>(controller.findWalletsByUser)
  )
  .post(
    '/',
    verifyAuth,
    validateSchema(CREATE_WALLET_SCHEMA),
    asyncHandler<AuthenticatedRequest>(controller.create)
  );

router
  .delete(
    '/:id',
    verifyAuth,
    asyncHandler<AuthenticatedRequest>(controller.delete)
  )
  .put(
    '/:id',
    verifyAuth,
    asyncHandler<AuthenticatedRequest>(controller.update)
  );

export { router as walletRoutes };
