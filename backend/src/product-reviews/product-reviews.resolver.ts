import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { ProductReviewsService } from './product-reviews.service';
import { PaginatedProductReview } from './entities/productReview.entity';
import { PaginationArgs } from 'src/lib/pagination.args';

@Resolver()
export class ProductReviewsResolver {
  constructor(private readonly productReviewsService: ProductReviewsService) {}

  @Query(() => PaginatedProductReview)
  async queryProductReviewsByProductId(
    @Args({ name: 'productId', type: () => Int }) productId: number,
    @Args() paginationArgs: PaginationArgs,
  ) {
    return this.productReviewsService.getPaginatedProductReviewsByProductId(
      productId,
      paginationArgs,
    );
  }
}
