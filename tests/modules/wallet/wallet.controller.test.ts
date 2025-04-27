import { WalletController } from '../../../src/modules/wallet/wallet.controller';
import { WalletService } from '../../../src/modules/wallet/wallet.service';
import { Request, Response } from 'express';

describe('WalletController', () => {
  let walletController: WalletController;
  let walletServiceMock: Partial<WalletService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    walletServiceMock = {
      createWallet: jest.fn(),
    };

    walletController = new WalletController(walletServiceMock as WalletService);

    req = {
      body: {
        userId: 'user123',
        name: 'Test Wallet',
        currency: 'USD',
        balance: 200,
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

    await walletController.create(req as Request, res as Response);

    expect(walletServiceMock.createWallet).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockWallet);
  });

  it('should handle errors and return 500', async () => {
    (walletServiceMock.createWallet as jest.Mock).mockRejectedValue(
      new Error('DB Error')
    );

    await walletController.create(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
