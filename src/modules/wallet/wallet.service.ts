import type { Wallet } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import type { CREATE_WALLET_SCHEMA_TYPE } from './wallet.types';
import type { WalletRepository } from './wallet.repository';

export class WalletService {
  constructor(private walletRepository: WalletRepository) {}

  async createWallet(
    data: CREATE_WALLET_SCHEMA_TYPE,
    userId: string
  ): Promise<Wallet> {
    const existing = await this.walletRepository.findByNameForUser(
      data.name,
      userId
    );
    if (existing) {
      throw new Error('Wallet with this name already exists');
    }
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
  ) {
    const updated = await this.walletRepository.updateOne(id, data, userId);
    return updated ? updated : null;
  }

  async deleteWallet(id: string, userId: string): Promise<boolean> {
    const count = await this.walletRepository.deleteOne(id, userId);
    return count > 0;
  }
}
