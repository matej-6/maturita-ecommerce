import { Resolver, ResolveField, Parent, Context } from '@nestjs/graphql';
import { CartItemsService } from './cart-items.service';
import { ProductVariant } from 'src/product-variants/entities/product-variant.entity';
import { GraphqlAppContext } from 'src/app.module';
import { CartItem } from './entities/cart-item.entity';

@Resolver(() => CartItem)
export class CartItemsResolver {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @ResolveField(() => ProductVariant, { name: 'productVariant' })
  async resolveProductVariant(
    @Parent() cartItem: CartItem,
    @Context() ctx: GraphqlAppContext,
  ) {
    return await ctx.loaders.cartItemProductVariantLoader.load(cartItem.id);
  }
}
