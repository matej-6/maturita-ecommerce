import { Field, ObjectType } from '@nestjs/graphql';
import { TimePeriod } from '../enum/time-period.enum';

@ObjectType()
export class OverallTrendStatistic {
  @Field(() => Number)
  percentChange: number;

  @Field(() => TimePeriod)
  timePeriod: TimePeriod;

  @Field(() => [RevenueDataPoint])
  points: RevenueDataPoint[];
}

@ObjectType()
export class RevenueDataPoint {
  @Field(() => String)
  date: string;

  @Field(() => Number)
  revenue: number;
}
