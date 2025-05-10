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

  findAllByUser = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.transactionService.getTransactionsByUser(
      userId,
      page,
      limit
    );

    return res.status(200).json(result);
  };

  findByWallet = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id;
    const walletId = req.params.walletId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.transactionService.getTransactionsByWallet(
      walletId,
      userId,
      page,
      limit
    );

    return res.status(200).json(result);
  };
}
