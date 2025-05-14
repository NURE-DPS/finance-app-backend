import type { Transaction } from '@prisma/client';
import type { CREATE_TRANSACTION_SCHEMA_TYPE } from './transaction.types';
import type { TransactionRepository } from './transaction.repository';

export class TransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  async createTransaction(
    data: CREATE_TRANSACTION_SCHEMA_TYPE,
    userId: string
  ): Promise<Transaction> {
    return this.transactionRepository.createOne(data, userId);
  }

  async getTransactionsByUser(userId: string, page: number, limit: number) {
    return this.transactionRepository.findManyByUser(userId, page, limit);
  }

  async getTransactionsByWallet(
    walletId: string,
    userId: string,
    page: number,
    limit: number
  ) {
    return this.transactionRepository.findManyByWallet(
      walletId,
      userId,
      page,
      limit
    );
  }

  async updateTransaction(
    id: string,
    data: Partial<CREATE_TRANSACTION_SCHEMA_TYPE>,
    userId: string
  ): Promise<Transaction | null> {
    return this.transactionRepository.updateOne(id, data, userId);
  }

  async deleteTransaction(id: string, userId: string): Promise<boolean> {
    return this.transactionRepository.deleteOne(id, userId);
  }
}
