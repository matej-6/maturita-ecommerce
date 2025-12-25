import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TimePeriod } from './enum/time-period.enum';
import { OverallTrendStatistic } from './entities/overall-trend-statistic.entity';

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getOverallSalesStatistic(
    timePeriod: TimePeriod,
  ): Promise<OverallTrendStatistic | null> {
    this.logger.log(
      `Fetching overall products statistic for time period: ${timePeriod}`,
    );

    const now = new Date();
    const startDate = new Date();

    switch (timePeriod) {
      case TimePeriod.LAST_SEVEN_DAYS:
        startDate.setDate(now.getDate() - 7);
        break;
      case TimePeriod.LAST_THIRTY_DAYS:
        startDate.setDate(now.getDate() - 30);
        break;
      case TimePeriod.LAST_NINETY_DAYS:
        startDate.setDate(now.getDate() - 90);
        break;
    }

    const ordersGroupedByDate = await this.prismaService.order.groupBy({
      by: ['createdAt'],
      _sum: {
        totalInCents: true,
      },
      where: {
        createdAt: { gte: startDate, lte: now },
        status: 'DELIVERED',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (ordersGroupedByDate.length === 0) {
      return null;
    }

    const zerothDateTotal = ordersGroupedByDate[0]?._sum.totalInCents || 0;
    const lastDateTotal =
      ordersGroupedByDate[ordersGroupedByDate.length - 1]?._sum.totalInCents ||
      0;

    const percentageChange =
      zerothDateTotal === 0
        ? lastDateTotal === 0
          ? 0
          : 100
        : ((lastDateTotal - zerothDateTotal) / zerothDateTotal) * 100;

    const xMin = ordersGroupedByDate[0].createdAt.toISOString().split('T')[0];
    const xMax = ordersGroupedByDate[ordersGroupedByDate.length - 1].createdAt
      .toISOString()
      .split('T')[0];

    const yMin = (
      Math.min(...ordersGroupedByDate.map((o) => o._sum.totalInCents || 0)) /
      100
    )
      .toFixed(2)
      .toString();

    const yMax = (
      Math.max(...ordersGroupedByDate.map((o) => o._sum.totalInCents || 0)) /
      100
    )
      .toFixed(2)
      .toString();

    return {
      percentChange: percentageChange,
      points: ordersGroupedByDate.map((entry) => ({
        x: entry.createdAt.toISOString().split('T')[0],
        y: ((entry._sum.totalInCents || 0) / 100).toFixed(2).toString(),
      })),
      timePeriod,
      xMin: xMin,
      xMax: xMax,
      yMin: yMin,
      yMax: yMax,
    };
  }
}
