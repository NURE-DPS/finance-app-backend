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
}
