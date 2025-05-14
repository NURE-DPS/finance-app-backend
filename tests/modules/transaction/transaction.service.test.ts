import { TransactionService } from '../../../src/modules/transaction/transaction.service';
import { TransactionRepository } from '../../../src/modules/transaction/transaction.repository';
import { Transaction, TransactionTypes } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactionRepositoryMock: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    transactionRepositoryMock = {
      createOne: jest.fn(),
    } as unknown as jest.Mocked<TransactionRepository>;

    transactionService = new TransactionService(transactionRepositoryMock);
  });

  it('should create a transaction', async () => {
    const mockData = {
      walletId: 'wallet123',
      type: 'INCOME' as const,
      amount: 100,
      currency: 'USD',
      createdAt: new Date().toISOString(),
    };

    const userId = 'user123';

    const mockTransaction: Transaction = {
      id: 'tx123',
      userId,
      walletId: mockData.walletId,
      type: TransactionTypes.INCOME, // 🔧 use enum
      amount: new Decimal(mockData.amount), // 🔧 use Decimal
      currency: mockData.currency,
      createdAt: new Date(),
      description: null,
      categoryId: null,
    };

    transactionRepositoryMock.createOne.mockResolvedValue(mockTransaction);

    const result = await transactionService.createTransaction(mockData, userId);

    expect(transactionRepositoryMock.createOne).toHaveBeenCalledWith(
      mockData,
      userId
    );
    expect(result).toEqual(mockTransaction);
  });

  it('should get transactions by wallet for a user with pagination', async () => {
    const walletId = 'wallet123';
    const userId = 'user123';
    const page = 1;
    const limit = 10;

    const mockResult = {
      data: [{ id: 'tx1' }, { id: 'tx2' }],
      meta: { total: 2, page, limit, totalPages: 1 },
    };

    transactionRepositoryMock.findManyByWallet = jest
      .fn()
      .mockResolvedValue(mockResult);

    transactionService = new TransactionService(transactionRepositoryMock);

    const result = await transactionService.getTransactionsByWallet(
      walletId,
      userId,
      page,
      limit
    );

    expect(transactionRepositoryMock.findManyByWallet).toHaveBeenCalledWith(
      walletId,
      userId,
      page,
      limit
    );
    expect(result).toEqual(mockResult);
  });

  it('should get transactions by user with pagination', async () => {
    const userId = 'user123';
    const page = 1;
    const limit = 10;

    const mockResult = {
      data: [{ id: 'tx1' }, { id: 'tx2' }],
      meta: { total: 2, page, limit, totalPages: 1 },
    };

    transactionRepositoryMock.findManyByUser = jest
      .fn()
      .mockResolvedValue(mockResult);

    transactionService = new TransactionService(transactionRepositoryMock);

    const result = await transactionService.getTransactionsByUser(
      userId,
      page,
      limit
    );

    expect(transactionRepositoryMock.findManyByUser).toHaveBeenCalledWith(
      userId,
      page,
      limit
    );
    expect(result).toEqual(mockResult);
  });

  it('should update a transaction', async () => {
    const transactionId = 'tx123';
    const userId = 'user123';
    const updateData = { amount: 200 };

    const updatedTransaction: Transaction = {
      id: transactionId,
      userId,
      walletId: 'wallet123',
      type: TransactionTypes.INCOME,
      amount: new Decimal(updateData.amount),
      currency: 'USD',
      createdAt: new Date(),
      description: null,
      categoryId: null,
    };

    transactionRepositoryMock.updateOne = jest
      .fn()
      .mockResolvedValue(updatedTransaction);

    const result = await transactionService.updateTransaction(
      transactionId,
      updateData,
      userId
    );

    expect(transactionRepositoryMock.updateOne).toHaveBeenCalledWith(
      transactionId,
      updateData,
      userId
    );
    expect(result).toEqual(updatedTransaction);
  });

  it('should return null if update fails (e.g., not found or access denied)', async () => {
    transactionRepositoryMock.updateOne = jest.fn().mockResolvedValue(null);

    const result = await transactionService.updateTransaction(
      'nonexistent',
      { amount: 200 },
      'user123'
    );

    expect(result).toBeNull();
  });

  it('should delete a transaction and return true', async () => {
    transactionRepositoryMock.deleteOne = jest.fn().mockResolvedValue(true);

    const result = await transactionService.deleteTransaction(
      'tx123',
      'user123'
    );

    expect(transactionRepositoryMock.deleteOne).toHaveBeenCalledWith(
      'tx123',
      'user123'
    );
    expect(result).toBe(true);
  });

  it('should return false if transaction not found or access denied for delete', async () => {
    transactionRepositoryMock.deleteOne = jest.fn().mockResolvedValue(false);

    const result = await transactionService.deleteTransaction(
      'nonexistent',
      'user123'
    );

    expect(result).toBe(false);
  });
});
