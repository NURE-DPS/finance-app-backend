import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Request, Response } from 'express';
import prisma from '@src/config/prismaClient';

const router = Router();
const walletService = new WalletService(prisma);
const controller = new WalletController(walletService);

router.post('/', (req: Request, res: Response) => {
  controller.create(req, res);
});

export { router as walletRoutes };
