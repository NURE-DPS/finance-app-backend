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
}
