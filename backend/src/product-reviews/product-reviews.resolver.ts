import {
  Args,
  Context,
  Int,
  Mutation,
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
import { ProductsService } from 'src/products/products.service';
import { GraphqlAppContext } from 'src/app.module';
import { ProductVariant } from 'src/product-variants/entities/product-variant.entity';
import { ProductVariantsService } from 'src/product-variants/product-variants.service';
import { ProductReviewAuthor } from './entities/productReviewAuthor.entity';
import { CreateProductReviewInput } from './inputs/createProductReview.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { UpdateProductReviewInput } from './inputs/updateProductReview.input';
import { AdminGuard } from 'src/auth/guards/admin.guard';

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

  @ResolveField(() => ProductVariant, {
    name: 'productVariant',
    nullable: true,
  })
  async resolveProductVariant(
    @Parent() review: ProductReview,
    @Context() ctx: GraphqlAppContext,
  ) {
    return await ctx.loaders.productVariantByProductReviewIdLoader.load(
      review.id,
    );
  }

  @ResolveField(() => ProductReviewAuthor, { name: 'author', nullable: true })
  async resolveAuthor(
    @Parent() review: ProductReview,
    @Context() ctx: GraphqlAppContext,
  ) {
    return await ctx.loaders.productReviewAuthorLoader.load(review.id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ProductReview)
  async createProductReview(
    @Args('input') input: CreateProductReviewInput,
    @CurrentUser() user: AuthenticatedUserDto,
  ) {
    const userId = user.id;
    return this.productReviewsService.createProductReview(userId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ProductReview)
  async updateProductReview(
    @Args('input') input: UpdateProductReviewInput,
    @CurrentUser() user: AuthenticatedUserDto,
  ) {
    const userId = user.id;
    return this.productReviewsService.updateProductReview(userId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteProductReview(
    @Args({ name: 'reviewId', type: () => Int }) reviewId: number,
    @CurrentUser() user: AuthenticatedUserDto,
  ) {
    const userId = user.id;
    await this.productReviewsService.deleteProductReview(userId, reviewId);
    return true;
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Boolean)
  async admin_deleteProductReview(
    @Args({ name: 'reviewId', type: () => Int }) reviewId: number,
  ) {
    await this.productReviewsService.admin_deleteProductReview(reviewId);
    return true;
  }
}
