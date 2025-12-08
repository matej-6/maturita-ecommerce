import { Field, Int, ObjectType } from '@nestjs/graphql';

import { ProductVariant as DbProductVariant } from 'generated/prisma/client';
import { Paginated } from 'src/lib/pagination';

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

@ObjectType()
export class PaginatedProductVariant extends Paginated(ProductVariant) {}
