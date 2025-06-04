import type { Response } from 'express';
import type { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ReportService } from './report.service';

export class ReportController {
  constructor(private reportService: ReportService) {}

  getCategoryReport = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id;
    const from = req.query.from as string;
    const to = req.query.to as string;

    if (!from || !to) {
      return res
        .status(400)
        .json({ message: 'Missing from or to query param' });
    }

    const data = await this.reportService.getReport(userId, from, to);
    return res.status(200).json(data);
  };

  getDateRange = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this.reportService.getDateRange(req.user.id);
    return res.status(200).json(result);
  };
}
