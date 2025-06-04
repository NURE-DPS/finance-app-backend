import { ReportRepository } from './report.repository';

export class ReportService {
  constructor(private reportRepository: ReportRepository) {}

  async getReport(
    userId: string,
    from: string,
    to: string
  ): Promise<
    { categoryId: string; name: string; icon: string | null; total: number }[]
  > {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.reportRepository.getExpensesByCategory(
      userId,
      fromDate,
      toDate
    );
  }

  async getDateRange(userId: string) {
    return this.reportRepository.getDateRange(userId);
  }
}
