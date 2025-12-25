import { Args, Query, Resolver } from '@nestjs/graphql';
import { StatisticsService } from './statistics.service';
import { OverallTrendStatistic } from './entities/overall-trend-statistic.entity';
import { TimePeriod } from './enum/time-period.enum';

@Resolver()
export class StatisticsResolver {
  constructor(private readonly statisticsService: StatisticsService) {}
  @Query(() => OverallTrendStatistic, { nullable: true })
  async overallSalesStatistic(
    @Args('timePeriod', { type: () => TimePeriod }) timePeriod: TimePeriod,
  ): Promise<OverallTrendStatistic | null> {
    return this.statisticsService.getOverallSalesStatistic(timePeriod);
  }
}
