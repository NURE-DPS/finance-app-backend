import type { Response } from 'express';
import type { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import type { TransactionService } from './transaction.service';

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    const newTransaction = await this.transactionService.createTransaction(
      req.body,
      req.user.id
    );
    return res.status(201).json(newTransaction);
  };
}
