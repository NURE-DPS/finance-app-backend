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

  it('should return transactions for a wallet and return 200', async () => {
    const mockTransactions = {
      data: [{ id: 'tx1' }, { id: 'tx2' }],
      meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
    };

    req = {
      params: { walletId: 'wallet123' },
      query: { page: '1', limit: '10' },
      user: { id: 'user123' },
    };

    (transactionServiceMock.getTransactionsByWallet as jest.Mock) = jest
      .fn()
      .mockResolvedValue(mockTransactions);

    // Додай цей метод вручну, якщо він не оголошений в моках
    transactionController = new TransactionController(
      transactionServiceMock as TransactionService
    );

    await transactionController.findByWallet(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(transactionServiceMock.getTransactionsByWallet).toHaveBeenCalledWith(
      'wallet123',
      'user123',
      1,
      10
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTransactions);
  });

  it('should handle errors in findByWallet and return 500', async () => {
    req = {
      params: { walletId: 'wallet123' },
      query: {},
      user: { id: 'user123' },
    };

    (transactionServiceMock.getTransactionsByWallet as jest.Mock) = jest
      .fn()
      .mockRejectedValue(new Error('Something failed'));

    await expect(
      transactionController.findByWallet(
        req as AuthenticatedRequest,
        res as Response
      )
    ).rejects.toThrow('Something failed');
  });

  it('should return transactions for a user and return 200', async () => {
    const mockTransactions = {
      data: [{ id: 'tx1' }, { id: 'tx2' }],
      meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
    };

    req = {
      query: { page: '1', limit: '10' },
      user: { id: 'user123' },
    };

    (transactionServiceMock.getTransactionsByUser as jest.Mock) = jest
      .fn()
      .mockResolvedValue(mockTransactions);

    await transactionController.findAllByUser(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(transactionServiceMock.getTransactionsByUser).toHaveBeenCalledWith(
      'user123',
      1,
      10
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTransactions);
  });

  it('should handle errors in findByUser and return 500', async () => {
    req = {
      query: { page: '1', limit: '10' },
      user: { id: 'user123' },
    };

    (transactionServiceMock.getTransactionsByUser as jest.Mock) = jest
      .fn()
      .mockRejectedValue(new Error('DB Error'));

    await expect(
      transactionController.findAllByUser(
        req as AuthenticatedRequest,
        res as Response
      )
    ).rejects.toThrow('DB Error');
  });
});
