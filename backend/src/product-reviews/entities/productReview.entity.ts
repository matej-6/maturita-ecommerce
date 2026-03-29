import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ProductReview as DbProductReview } from 'generated/prisma/client';
import { Paginated } from 'src/lib/pagination';

@ObjectType()
export class ProductReview implements Partial<DbProductReview> {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  comment: string | null;

  @Field(() => String)
  lang: string;

  @Field(() => Int)
  orderItemId: number | null;

  @Field(() => Int)
  rating: number;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class PaginatedProductReview extends Paginated(ProductReview) {}
