import { Field, ObjectType } from '@nestjs/graphql';
import { TimePeriod } from '../enum/time-period.enum';

@ObjectType()
export class OverallTrendStatistic {
  @Field(() => Number)
  percentChange: number;

  @Field(() => TimePeriod)
  timePeriod: TimePeriod;

  @Field(() => String)
  xMin: string;

  @Field(() => String)
  xMax: string;

  @Field(() => String)
  yMin: string;

  @Field(() => String)
  yMax: string;

  @Field(() => [DataPoint])
  points: DataPoint[];
}

@ObjectType()
export class DataPoint {
  @Field(() => String)
  x: string;

  @Field(() => String)
  y: string;
}
