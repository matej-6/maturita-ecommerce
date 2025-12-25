import { registerEnumType } from '@nestjs/graphql';

export enum TimePeriod {
  LAST_SEVEN_DAYS = 'LAST_7_DAYS',
  LAST_THIRTY_DAYS = 'LAST_30_DAYS',
  LAST_NINETY_DAYS = 'LAST_90_DAYS',
}

registerEnumType(TimePeriod, {
  name: 'TimePeriod',
});
