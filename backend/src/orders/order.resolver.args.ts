import { ArgsType, Field, Int } from '@nestjs/graphql';
import { OrderStatus } from 'generated/prisma/enums';

@ArgsType()
export class OrderFindAllQueryArgs {
  @Field(() => Int, { nullable: true })
  id: number | null;

  @Field(() => Int, { nullable: true })
  userId: number | null;

  @Field(() => OrderStatus, { nullable: true })
  status: OrderStatus | null;

  @Field(() => Int, { nullable: true })
  minPrice: number | null;

  @Field(() => Int, { nullable: true })
  maxPrice: number | null;

  @Field(() => Date, { nullable: true })
  dateFrom: Date | null;

  @Field(() => Date, { nullable: true })
  dateTo: Date | null;
}

@ArgsType()
export class OrderSortingArgs {
  @Field(() => String, { nullable: true })
  sortBy: string | null;

  @Field(() => Boolean, { nullable: true })
  ascending: boolean | null;
}
