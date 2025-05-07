import prisma from '../../config/prismaClient';
import type { Transaction } from '@prisma/client';
import type { CREATE_TRANSACTION_SCHEMA_TYPE } from './transaction.types';
import { Prisma } from '@prisma/client';

export class TransactionRepository {
  async createOne(
    data: CREATE_TRANSACTION_SCHEMA_TYPE,
    userId: string
  ): Promise<Transaction> {
    const isIncome = data.type === 'INCOME';
    const amountDelta = isIncome ? data.amount : -data.amount;

    return await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { id: data.walletId },
      });

      if (!wallet) throw new Error('Wallet not found');

      // Ensure currencies match
      if (wallet.currency !== data.currency) {
        throw new Error('Transaction currency must match wallet currency');
      }

      const transaction = await tx.transaction.create({
        data: {
          ...data,
          userId,
        },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: new Prisma.Decimal(wallet.balance).plus(amountDelta),
        },
      });

      return transaction;
    });
  }
}
