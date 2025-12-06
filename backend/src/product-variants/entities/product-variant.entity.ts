import { Field, Int, ObjectType } from '@nestjs/graphql';

import { ProductVariant as DbProductVariant } from 'generated/prisma/client';

@ObjectType()
export class ProductVariant implements Partial<DbProductVariant> {
  @Field(() => Int)
  id: number;
  @Field(() => Boolean)
  isPublic: boolean;
  @Field(() => Int)
  priceInCents: number;
  @Field(() => Int)
  productId: number;
  @Field(() => String)
  sku: string;
  @Field(() => Int)
  stock: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
