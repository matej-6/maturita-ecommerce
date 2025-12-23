import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OrderItem as DbOrderItem } from 'generated/prisma/client';

@ObjectType()
export class OrderItem implements Partial<DbOrderItem> {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  orderId: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => String)
  sku: string;

  @Field(() => Int)
  unitPriceInCents: number;

  @Field(() => Int, { nullable: true })
  productVariantId: number | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
