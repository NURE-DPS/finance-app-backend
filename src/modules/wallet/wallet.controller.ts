import { Request, Response } from 'express';
import { WalletService } from './wallet.service';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';

export class WalletController {
  constructor(private walletService: WalletService) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const wallet = await this.walletService.createWallet(req.body, req.user.id);
      return res.status(201).json(wallet);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
