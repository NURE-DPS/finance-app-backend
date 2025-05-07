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
      type: 'INCOME' as const, // 🔧 cast to literal type
      amount: 100,
      currency: 'USD',
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
});
