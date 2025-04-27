import { WalletService } from '../../../src/modules/wallet/wallet.service';
import { WalletRepository } from '../../../src/modules/wallet/wallet.repository';
import { Wallet } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('WalletService', () => {
  let walletService: WalletService;
  let walletRepositoryMock: jest.Mocked<WalletRepository>;

  beforeEach(() => {
    walletRepositoryMock = {
      createOne: jest.fn(),
      findAllByUserId: jest.fn(),
    } as unknown as jest.Mocked<WalletRepository>;

    walletService = new WalletService(walletRepositoryMock);
  });

  it('should create a wallet', async () => {
    const mockData = {
      name: 'My Wallet',
      currency: 'USD',
      balance: 10,
    };
    const userId = 'user123';

    const expectedWallet: Wallet = {
      id: 'wallet123',
      name: mockData.name,
      currency: mockData.currency,
      balance: new Decimal(mockData.balance),
      userId: userId,
      createdAt: new Date(),
    };

    walletRepositoryMock.createOne.mockResolvedValue(expectedWallet);

    const result = await walletService.createWallet(mockData, userId);

    expect(walletRepositoryMock.createOne).toHaveBeenCalledWith(
      mockData,
      userId
    );
    expect(result).toEqual(expectedWallet);
  });

  it('should find all wallets for a user', async () => {
    const userId = 'user123';

    const expectedWallets: Wallet[] = [
      {
        id: 'wallet123',
        name: 'My Wallet',
        currency: 'USD',
        balance: new Decimal(100),
        userId: userId,
        createdAt: new Date(),
      },
    ];

    walletRepositoryMock.findAllByUserId.mockResolvedValue(expectedWallets);

    const result = await walletService.findAllWallets(userId);

    expect(walletRepositoryMock.findAllByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual(expectedWallets);
  });
});
