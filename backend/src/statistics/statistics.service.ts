import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TimePeriod } from './enum/time-period.enum';
import { OverallTrendStatistic } from './entities/overall-trend-statistic.entity';
import { BestSellingProductVariant } from './entities/best-selling-product-variant.entity';
import { BestSellingCategory } from './entities/best-selling-category';

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getRevenuePerDayStatistic(
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

    const ordersGroupedByDate = await this.prismaService.$queryRaw<
      { totalInCents: number; createdAt: Date }[]
    >`
    SELECT DATE(createdAt) as createdAt, SUM(totalInCents) as totalInCents
    FROM orders
    WHERE createdAt BETWEEN ${startDate} AND ${now} AND status = 'DELIVERED'
    GROUP BY 1
    ORDER BY 1 ASC;
    `;

    this.logger.log(
      `Fetched ${ordersGroupedByDate.length} grouped orders from database`,
    );
    this.logger.debug(`Grouped orders: ${JSON.stringify(ordersGroupedByDate)}`);

    if (ordersGroupedByDate.length === 0) {
      return null;
    }

    const zerothDateTotal =
      ordersGroupedByDate[0].createdAt.getUTCDate() === startDate.getUTCDate()
        ? ordersGroupedByDate[0].totalInCents
        : 0;
    const lastDateTotal =
      ordersGroupedByDate[ordersGroupedByDate.length - 1]?.totalInCents;

    const percentageChange =
      zerothDateTotal === 0
        ? lastDateTotal === 0
          ? 0
          : 100
        : ((lastDateTotal - zerothDateTotal) / zerothDateTotal) * 100;

    const points = [];
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const orderForDate = ordersGroupedByDate.find(
        (entry) => entry.createdAt.toISOString().split('T')[0] === dateStr,
      );
      if (orderForDate) {
        points.push({
          x: dateStr,
          y: (orderForDate.totalInCents / 100).toFixed(2).toString(),
          label: dateStr,
        });
      } else {
        points.push({
          x: dateStr,
          y: '0.00',
          label: dateStr,
        });
      }
    }

    return {
      percentChange: percentageChange,
      points: points,
      timePeriod,
    };
  }

  async getBestSellingProductVariants(
    timePeriod: TimePeriod,
    n = 10,
  ): Promise<BestSellingProductVariant[]> {
    this.logger.log(
      `Fetching best selling products for time period: ${timePeriod}`,
    );

    if (n <= 0 || n > 20) {
      n = 10;
    }

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

    const bestSellingProductVariants =
      await this.prismaService.orderItem.groupBy({
        by: ['productVariantId'],
        _sum: {
          quantity: true,
        },
        where: {
          Order: {
            createdAt: { gte: startDate, lte: now },
            status: 'DELIVERED',
          },
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: n,
      });

    const productVariantIds = bestSellingProductVariants
      .map((item) => item.productVariantId)
      .filter((id) => id !== null);

    const productVariants = await this.prismaService.productVariant.findMany({
      where: {
        id: { in: productVariantIds },
      },
    });

    return bestSellingProductVariants.map((item) => {
      const productVariant = productVariants.find(
        (pv) => pv.id === item.productVariantId,
      );
      return {
        productVariant: productVariant!,
        quantitySold: item._sum.quantity || 0,
      };
    });
  }

  async getBestSellingCategories(
    timePeriod: TimePeriod,
    n = 10,
  ): Promise<BestSellingCategory[]> {
    if (n <= 0 || n > 20) {
      n = 10;
    }

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

    const allOrderItems = await this.prismaService.orderItem.findMany({
      where: {
        Order: {
          createdAt: { gte: startDate, lte: now },
          status: 'DELIVERED',
        },
      },
      include: {
        ProductVariant: {
          include: {
            Product: {
              include: {
                Category: true,
              },
            },
          },
        },
      },
    });

    const categorySalesMap: {
      [categoryId: number]: {
        totalRevenueInCents: number;
        itemsSold: number;
      };
    } = {};
    allOrderItems
      .filter((oi) => oi.ProductVariant && oi.ProductVariant.Product.Category)
      .forEach((item) => {
        const category = item.ProductVariant!.Product.Category!;
        if (!categorySalesMap[category.id]) {
          categorySalesMap[category.id] = {
            totalRevenueInCents: 0,
            itemsSold: 0,
          };
        }
        categorySalesMap[category.id].itemsSold += item.quantity;
        categorySalesMap[category.id].totalRevenueInCents +=
          item.quantity * item.unitPriceInCents;
      });
    const sortedCategories = Object.entries(categorySalesMap)
      .sort((a, b) => b[1].itemsSold - a[1].itemsSold)
      .slice(0, n);

    const categoryIds = sortedCategories.map(([categoryId]) =>
      Number(categoryId),
    );
    const categories = await this.prismaService.category.findMany({
      where: { id: { in: categoryIds } },
    });

    return sortedCategories.map(([categoryId, stats]) => {
      const category = categories.find((cat) => cat.id === Number(categoryId))!;
      return {
        category: {
          ...category,
          isSetup: true,
        },
        itemsSold: stats.itemsSold,
        totalRevenueInCents: stats.totalRevenueInCents,
      };
    });
  }
}
