import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OrderItem } from './entities/order-item.entity';
import { ProductVariant } from 'src/product-variants/entities/product-variant.entity';
import { GraphqlAppContext } from 'src/app.module';
import { ProductReview } from 'src/product-reviews/entities/productReview.entity';

@Resolver(() => OrderItem)
export class OrderItemsResolver {
  @ResolveField(() => ProductVariant, {
    nullable: true,
    name: 'productVariant',
  })
  async resolveProductVariant(
    @Parent() orderItem: OrderItem,
    @Context() ctx: GraphqlAppContext,
  ): Promise<ProductVariant | null> {
    return await ctx.loaders.orderItemProductVariantLoader.load(orderItem.id);
  }

  @ResolveField(() => ProductReview, { nullable: true, name: 'productReview' })
  async resolveProductReview(
    @Parent() orderItem: OrderItem,
    @Context() ctx: GraphqlAppContext,
  ): Promise<ProductReview | null> {
    return await ctx.loaders.orderItemProductReviewLoader.load(orderItem.id);
  }
}
