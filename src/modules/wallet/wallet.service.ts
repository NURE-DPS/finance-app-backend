import { PrismaClient, Wallet } from '@prisma/client';
import { CREATE_WALLET_SCHEMA_TYPE } from './wallet.types';
import { WalletRepository } from './wallet.repository';

export class WalletService {
  constructor(private walletRepository: WalletRepository) {}

  async createWallet(
    data: CREATE_WALLET_SCHEMA_TYPE,
    userId: string
  ): Promise<Wallet> {
    return this.walletRepository.createOne(data, userId);
  }

  async findAllWallets(userId: string): Promise<Wallet[]> {
    return this.walletRepository.findAllByUserId(userId);
  }

  async findWallet(id: string): Promise<Wallet | null> {
    return this.walletRepository.findOne(id);
  }

  async updateWallet(
    id: string,
    data: Partial<CREATE_WALLET_SCHEMA_TYPE>,
    userId: string
  ): Promise<Wallet | null> {
    const wallet = await this.walletRepository.findOne(id);
    if (!wallet || wallet.userId !== userId) return null;
    return this.walletRepository.updateOne(id, data);
  }

  async deleteWallet(id: string, userId: string): Promise<boolean> {
    const wallet = await this.walletRepository.findOne(id);
    if (!wallet || wallet.userId !== userId) return false;
    await this.walletRepository.deleteOne(id);
    return true;
  }
}
