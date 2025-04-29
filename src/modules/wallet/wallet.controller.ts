import { Request, Response } from 'express';
import { WalletService } from './wallet.service';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';

export class WalletController {
  constructor(private walletService: WalletService) {}

  create = async (req: AuthenticatedRequest, res: Response) => {
    try {
      return res
        .status(201)
        .json(await this.walletService.createWallet(req.body, req.user.id));
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  findWalletsByUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      return res
        .status(200)
        .json(await this.walletService.findAllWallets(req.user.id));
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  update = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const walletId = req.params.id;
      const updatedWallet = await this.walletService.updateWallet(
        walletId,
        req.body,
        req.user.id
      );
      if (!updatedWallet) {
        return res
          .status(404)
          .json({ message: 'Wallet not found or access denied' });
      }
      return res.status(200).json(updatedWallet);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  delete = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const walletId = req.params.id;
      const deleted = await this.walletService.deleteWallet(
        walletId,
        req.user.id
      );
      if (!deleted) {
        return res
          .status(404)
          .json({ message: 'Wallet not found or access denied' });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
