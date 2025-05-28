import prisma from '../../config/prismaClient';
import type { CREATE_WALLET_SCHEMA_TYPE } from './wallet.types';
import type { Wallet } from '@prisma/client';

export class WalletRepository {
  async findByNameForUser(
    name: string,
    userId: string
  ): Promise<Wallet | null> {
    return await prisma.wallet.findFirst({
      where: {
        name,
        userId,
      },
    });
  }

  async createOne(
    data: CREATE_WALLET_SCHEMA_TYPE,
    userId: string
  ): Promise<Wallet> {
    return await prisma.wallet.create({
      data: {
        name: data.name,
        currency: data.currency,
        balance: data.balance,
        userId: userId,
      },
    });
  }

  async findAllByUserId(userId: string): Promise<Wallet[]> {
    return await prisma.wallet.findMany({
      where: { userId: userId },
    });
  }

  async findOne(id: string): Promise<Wallet | null> {
    return await prisma.wallet.findUnique({
      where: { id },
    });
  }

  async updateOne(
    id: string,
    data: Partial<CREATE_WALLET_SCHEMA_TYPE>,
    userId: string
  ): Promise<Wallet | null> {
    return await prisma.wallet.update({
      where: { id, userId },
      data,
    });
  }

  async deleteOne(id: string, userId: string): Promise<number> {
    const { count } = await prisma.wallet.deleteMany({
      where: { id, userId },
    });
    return count;
  }
}
