import { WalletController } from '../../../src/modules/wallet/wallet.controller';
import { WalletService } from '../../../src/modules/wallet/wallet.service';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../../src/types/AuthenticatedRequest';

describe('WalletController', () => {
  let walletController: WalletController;
  let walletServiceMock: Partial<WalletService>;
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    walletServiceMock = {
      createWallet: jest.fn(),
      findAllWallets: jest.fn(),
    };

    walletController = new WalletController(walletServiceMock as WalletService);

    req = {
      body: {
        name: 'Test Wallet',
        currency: 'USD',
        balance: 200,
      },
      user: {
        id: 'user123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should create a wallet and return 201', async () => {
    const mockWallet = { id: 'wallet123', ...req.body };

    (walletServiceMock.createWallet as jest.Mock).mockResolvedValue(mockWallet);

    await walletController.create(req as AuthenticatedRequest, res as Response);

    expect(walletServiceMock.createWallet).toHaveBeenCalledWith(
      req.body,
      req.user!.id
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockWallet);
  });

  it('should handle errors and return 500', async () => {
    (walletServiceMock.createWallet as jest.Mock).mockRejectedValue(
      new Error('DB Error')
    );

    await expect(
      walletController.create(req as AuthenticatedRequest, res as Response)
    ).rejects.toThrow('DB Error');
  });

  it('should find all wallets for a user and return 200', async () => {
    const mockWallets = [
      {
        id: 'wallet1',
        name: 'Wallet 1',
        currency: 'USD',
        balance: 100,
        userId: 'user123',
        createdAt: new Date(),
      },
      {
        id: 'wallet2',
        name: 'Wallet 2',
        currency: 'EUR',
        balance: 200,
        userId: 'user123',
        createdAt: new Date(),
      },
    ];

    (walletServiceMock.findAllWallets as jest.Mock).mockResolvedValue(
      mockWallets
    );

    await walletController.findWalletsByUser(
      req as AuthenticatedRequest,
      res as Response
    );

    expect(walletServiceMock.findAllWallets).toHaveBeenCalledWith(req.user!.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockWallets);
  });
});
