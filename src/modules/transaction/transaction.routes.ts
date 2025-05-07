import { Router } from 'express';
import { validateSchema } from '../../middleware/validateSchema';
import { verifyAuth } from '../auth/auth.middleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { CREATE_TRANSACTION_SCHEMA } from './transaction.types';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

const router = Router();
const repository = new TransactionRepository();
const service = new TransactionService(repository);
const controller = new TransactionController(service);

router.post(
  '/',
  verifyAuth,
  validateSchema(CREATE_TRANSACTION_SCHEMA),
  asyncHandler(controller.create)
);

export { router as transactionRoutes };
