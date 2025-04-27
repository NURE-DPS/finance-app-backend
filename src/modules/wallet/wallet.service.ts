import { PrismaClient, Wallet } from '@prisma/client';
import { CREATE_WALLET_SCHEMA_TYPE } from './wallet.types';

export class WalletService {
  constructor(private prisma: PrismaClient) {}

  async createWallet(data: CREATE_WALLET_SCHEMA_TYPE): Promise<Wallet> {
    return this.prisma.wallet.create({
      data: {
        name: data.name,
        currency: data.currency,
        balance: data.balance,
        userId: data.userId,
      },
    });
  }

  async findAllWallets(userId: string): Promise<Wallet[]> {
    return this.walletRepository.findAllByUserId(userId);
  }

  async findAllWallets(userId: string): Promise<Wallet[]> {
    return this.walletRepository.findAllByUserId(userId);
  }
}
