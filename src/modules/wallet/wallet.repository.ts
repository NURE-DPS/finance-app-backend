import prisma from '../../config/prismaClient';
import { CREATE_WALLET_SCHEMA_TYPE } from './wallet.types';
import { Wallet } from '@prisma/client';

export class WalletRepository {
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
      where: {id}
    })
  }

  async deleteOne(id: string): Promise<Wallet> {
    return await prisma.wallet.delete({
      where: { id },
    });
  }
}
