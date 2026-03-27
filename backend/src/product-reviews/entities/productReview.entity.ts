import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ProductReview as DbProductReview } from 'generated/prisma/client';
import { Paginated } from 'src/lib/pagination';

@ObjectType()
export class ProductReview implements Partial<DbProductReview> {
  @Field(() => Int, { description: 'Product ID' })
  id: number;

  @Field(() => String, { nullable: true })
  comment: string | null;

  @Field(() => String)
  lang: string;

  @Field(() => Int)
  orderItemId: number | null;

  @Field(() => Int)
  productVariantId: number | null;

  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  rating: number;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class PaginatedProductReview extends Paginated(ProductReview) {}
