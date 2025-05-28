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

      const newBalance = new Prisma.Decimal(wallet.balance).plus(amountDelta);

      if (newBalance.lessThan(0)) {
        throw new Error(
          'Your wallet does not have enough funds for this transaction.'
        );
      }

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

  async updateOne(
    id: string,
    data: Partial<CREATE_TRANSACTION_SCHEMA_TYPE>,
    userId: string
  ): Promise<Transaction | null> {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({ where: { id } });
      if (!existing || existing.userId !== userId) return null;

      const wallet = await tx.wallet.findUnique({
        where: { id: existing.walletId },
      });
      if (!wallet) throw new Error('Wallet not found');

      const oldDelta =
        existing.type === 'INCOME' ? -existing.amount : existing.amount;

      const tempBalance = new Prisma.Decimal(wallet.balance).plus(oldDelta);

      const newDelta =
        data.type && data.amount
          ? data.type === 'INCOME'
            ? data.amount
            : -data.amount
          : 0;

      const newBalance = tempBalance.plus(newDelta);

      if ((data.amount || data.type) && newBalance.lessThan(0)) {
        throw new Error(
          'Your wallet does not have enough funds for this transaction.'
        );
      }

      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: newBalance,
        },
      });

      const updated = await tx.transaction.update({
        where: { id },
        data,
      });

      return updated;
    });
  }

  async deleteOne(id: string, userId: string): Promise<boolean> {
    return await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({ where: { id } });
      if (!transaction || transaction.userId !== userId) return false;

      const wallet = await tx.wallet.findUnique({
        where: { id: transaction.walletId },
      });
      if (!wallet) throw new Error('Wallet not found');

      const delta =
        transaction.type === 'INCOME'
          ? -transaction.amount
          : transaction.amount;

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: new Prisma.Decimal(wallet.balance).plus(delta) },
      });

      await tx.transaction.delete({ where: { id } });

      return true;
    });
  }
}
