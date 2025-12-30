import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsResolver } from './statistics.resolver';

@Module({
  imports: [],
  providers: [StatisticsResolver, StatisticsService],
})
export class StatisticsModule {}
