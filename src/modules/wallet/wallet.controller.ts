import { Request, Response } from 'express';
import { WalletService } from './wallet.service';

export class WalletController {
  constructor(private walletService: WalletService) {}

  create = async (req: Request, res: Response) => {
    try {
<<<<<<< Updated upstream
      const wallet = await this.walletService.createWallet(req.body);
      return res.status(201).json(wallet);
=======
      return res
        .status(201)
        .json(await this.walletService.createWallet(req.body, req.user.id));
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  findAllWalletsByUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      return res
        .status(200)
        .json(await this.walletService.findAllWallets(req.user.id));
>>>>>>> Stashed changes
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
