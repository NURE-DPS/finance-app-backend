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

      const transaction = await tx.transaction.create({
        data: {
          ...data,
          userId,
          currency: wallet.currency,
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

  async findManyByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where: { userId } }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findManyByWallet(
    walletId: string,
    userId: string,
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          walletId,
          userId,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({
        where: {
          walletId,
          userId,
        },
      }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
