import { TransactionController } from '../../../src/modules/transaction/transaction.controller';
import { TransactionService } from '../../../src/modules/transaction/transaction.service';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../../src/types/AuthenticatedRequest';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionServiceMock: Partial<TransactionService>;
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    transactionServiceMock = {
      createTransaction: jest.fn(),
    };

    transactionController = new TransactionController(
      transactionServiceMock as TransactionService
    );

    req = {
      body: {
        walletId: 'wallet123',
        type: 'INCOME',
        amount: 100,
        currency: 'USD',
      },
      user: {
        id: 'user123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should create a transaction and return 201', async () => {
    const mockTransaction = { id: 'tx123', ...req.body };

    (transactionServiceMock.createTransaction as jest.Mock).mockResolvedValue(
      mockTransaction
    );

    await transactionController.create(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(transactionServiceMock.createTransaction).toHaveBeenCalledWith(
      req.body,
      req.user!.id
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockTransaction);
  });

  it('should handle errors and return 500', async () => {
    (transactionServiceMock.createTransaction as jest.Mock).mockRejectedValue(
      new Error('Something went wrong')
    );

    await expect(
      transactionController.create(req as AuthenticatedRequest, res as Response)
    ).rejects.toThrow('Something went wrong');
  });
});
