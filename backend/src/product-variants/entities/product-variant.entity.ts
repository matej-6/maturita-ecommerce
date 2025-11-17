import { Field, ObjectType } from '@nestjs/graphql';

import { ProductVariant as DbProductVariant } from 'generated/prisma/client';

@ObjectType()
export class ProductVariant implements Partial<DbProductVariant> {
  @Field(() => Number)
  id: number;
  @Field(() => Boolean)
  isPublic: boolean;
  @Field(() => Number)
  priceInCents: number;
  @Field(() => Number)
  productId: number;
  @Field(() => String)
  sku: string;
}
