import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OrderItem } from './entities/order-item.entity';
import { ProductVariant } from 'src/product-variants/entities/product-variant.entity';
import { GraphqlAppContext } from 'src/app.module';

@Resolver(() => OrderItem)
export class OrderItemsResolver {
  @ResolveField(() => ProductVariant, { nullable: true })
  async resolveProductVariant(
    @Parent() orderItem: OrderItem,
    @Context() ctx: GraphqlAppContext,
  ): Promise<ProductVariant | null> {
    return await ctx.loaders.orderItemProductVariantLoader.load(orderItem.id);
  }
}
