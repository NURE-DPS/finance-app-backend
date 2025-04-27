import { WalletService } from '../../../src/modules/wallet/wallet.service';
import { PrismaClient } from '@prisma/client';

const prismaMock = {
  wallet: {
    create: jest.fn(),
  },
} as unknown as PrismaClient;

describe('WalletService', () => {
  let walletService: WalletService;

  beforeEach(() => {
    walletService = new WalletService(prismaMock);
  });

  it('should create a wallet', async () => {
    const mockData = {
      userId: 'user123',
      name: 'My Wallet',
      currency: 'USD',
      balance: 100,
    };

    const expectedWallet = { id: 'wallet123', ...mockData };

    (prismaMock.wallet.create as jest.Mock).mockResolvedValue(expectedWallet);

    const result = await walletService.createWallet(mockData);

    expect(prismaMock.wallet.create).toHaveBeenCalledWith({
      data: {
        name: mockData.name,
        currency: mockData.currency,
        balance: mockData.balance,
        userId: mockData.userId,
      },
    });

    expect(result).toEqual(expectedWallet);
  });
});
