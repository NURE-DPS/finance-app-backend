import prisma from '../../config/prismaClient';

export class ReportRepository {
  async getExpensesByCategory(userId: string, from: Date, to: Date) {
    const result = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: 'EXPENSE',
        createdAt: {
          gte: from,
          lte: to,
        },
        categoryId: {
          not: null,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
    });

    const categories = await prisma.category.findMany({
      where: {
        id: { in: result.map((r) => r.categoryId!) },
      },
      select: {
        id: true,
        name: true,
        icon: true,
      },
    });

    const categoryMap = Object.fromEntries(
      categories.map((c) => [c.id, { name: c.name, icon: c.icon }])
    );

    return result.map((r) => ({
      categoryId: r.categoryId!,
      name: categoryMap[r.categoryId!]?.name || 'Unknown',
      icon: categoryMap[r.categoryId!]?.icon || null,
      total: r._sum.amount?.toNumber() || 0,
    }));
  }

  async getDateRange(userId: string) {
    const [min, max] = await Promise.all([
      prisma.transaction.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      }),
      prisma.transaction.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    return {
      minDate: min?.createdAt ?? null,
      maxDate: max?.createdAt ?? null,
    };
  }
}
