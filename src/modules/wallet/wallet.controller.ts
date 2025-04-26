import { Request, Response } from 'express';
import { CREATE_WALLET_SCHEMA } from './wallet.types';
import { WalletService } from './wallet.service';

export class WalletController {
  constructor(private walletService: WalletService) {}

  create = async (req: Request, res: Response) => {
    const parsed = CREATE_WALLET_SCHEMA.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error.format());
    }

    try {
      const wallet = await this.walletService.createWallet(parsed.data);
      return res.status(201).json(wallet);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
