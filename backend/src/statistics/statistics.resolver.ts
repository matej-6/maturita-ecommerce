import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { StatisticsService } from './statistics.service';
import { OverallTrendStatistic } from './entities/overall-trend-statistic.entity';
import { TimePeriod } from './enum/time-period.enum';
import { BestSellingProductVariant } from './entities/best-selling-product-variant.entity';
import { BestSellingCategory } from './entities/best-selling-category';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Resolver()
export class StatisticsResolver {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(AdminGuard)
  @Query(() => OverallTrendStatistic, {
    nullable: true,
    name: 'revenuePerDayStatistic',
  })
  async revenuePerDayStatistic(
    @Args('timePeriod', { type: () => TimePeriod }) timePeriod: TimePeriod,
  ): Promise<OverallTrendStatistic | null> {
    return this.statisticsService.getRevenuePerDayStatistic(timePeriod);
  }

  @UseGuards(AdminGuard)
  @Query(() => [BestSellingProductVariant], {
    nullable: true,
    name: 'bestSellingProductVariantsStatistic',
  })
  async bestSellingProductVariantsStatistic(
    @Args('timePeriod', { type: () => TimePeriod }) timePeriod: TimePeriod,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<BestSellingProductVariant[] | null> {
    return this.statisticsService.getBestSellingProductVariants(
      timePeriod,
      limit,
    );
  }

  @UseGuards(AdminGuard)
  @Query(() => [BestSellingCategory], {
    nullable: true,
    name: 'bestSellingCategoriesStatistic',
  })
  async bestSellingCategoriesStatistic(
    @Args('timePeriod', { type: () => TimePeriod }) timePeriod: TimePeriod,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<BestSellingCategory[] | null> {
    return this.statisticsService.getBestSellingCategories(timePeriod, limit);
  }
}
