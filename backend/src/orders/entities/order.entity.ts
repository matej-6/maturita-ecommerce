import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Order as DbOrder, OrderStatus } from 'generated/prisma/client';
import { Paginated } from 'src/lib/pagination';

@ObjectType()
export class Order implements Partial<DbOrder> {
  @Field(() => Int)
  id: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Int)
  totalInCents: number;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Int)
  userId: number;
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@ObjectType()
export class PaginatedOrder extends Paginated(Order) {}
