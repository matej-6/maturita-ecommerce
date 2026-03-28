import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProductReviewsService } from './product-reviews.service';
import {
  PaginatedProductReview,
  ProductReview,
} from './entities/productReview.entity';
import { PaginationArgs } from 'src/lib/pagination.args';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { GraphqlAppContext } from 'src/app.module';
import { ProductVariant } from 'src/product-variants/entities/product-variant.entity';
import { ProductVariantsService } from 'src/product-variants/product-variants.service';
import { ProductReviewAuthor } from './entities/productReviewAuthor.entity';

@Resolver(() => ProductReview)
export class ProductReviewsResolver {
  constructor(
    private readonly productReviewsService: ProductReviewsService,
    private readonly productsService: ProductsService,
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Query(() => PaginatedProductReview, {
    name: 'paginatedProductReviewsByProductId',
  })
  async queryProductReviewsByProductId(
    @Args({ name: 'productId', type: () => Int }) productId: number,
    @Args() paginationArgs: PaginationArgs,
  ) {
    return this.productReviewsService.getPaginatedProductReviewsByProductId(
      productId,
      paginationArgs,
    );
  }

  @ResolveField(() => Product, { name: 'product', nullable: true })
  async resolveProduct(
    @Parent() review: ProductReview,
    @Context() ctx: GraphqlAppContext,
  ) {
    return this.productsService.findOne({
      id: review.productId,
      isPublic: true,
      isSetup: null,
    });
  }

  @ResolveField(() => ProductVariant, {
    name: 'productVariant',
    nullable: true,
  })
  async resolveProductVariant(
    @Parent() review: ProductReview,
    @Context() ctx: GraphqlAppContext,
  ) {
    if (!review.productVariantId) {
      return null;
    }
    return this.productVariantsService.findOne(review.productVariantId, true);
  }

  @ResolveField(() => ProductReviewAuthor, { name: 'author', nullable: true })
  async resolveAuthor(
    @Parent() review: ProductReview,
    @Context() ctx: GraphqlAppContext,
  ) {
    return this.productReviewsService.getAuthorByProductReviewId(review.id);
  }
}
