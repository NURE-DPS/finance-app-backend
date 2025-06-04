import { Router } from 'express';
import { verifyAuth } from '../auth/auth.middleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import { ReportRepository } from './report.repository';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';

const router = Router();

const repository = new ReportRepository();
const service = new ReportService(repository);
const controller = new ReportController(service);

router.get(
  '/category-summary',
  verifyAuth,
  asyncHandler(controller.getCategoryReport)
);
router.get('/date-range', verifyAuth, asyncHandler(controller.getDateRange));

export { router as reportRoutes };
