import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CartItem as DbCartItem } from 'generated/prisma/client';

@ObjectType()
export class CartItem implements Partial<DbCartItem> {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  cartId: number;

  @Field(() => Int)
  productVariantId: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
