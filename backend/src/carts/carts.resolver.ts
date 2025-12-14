import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from '../cart-items/entities/cart-item.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';

@Resolver(() => Cart)
export class CartsResolver {
  constructor(private readonly cartsService: CartsService) {}

  @ResolveField(() => [CartItem], { name: 'items' })
  async resolveCartItems(@Parent() cart: Cart) {
    return await this.cartsService.getCartItems(cart.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Cart, { name: 'cart' })
  async queryGetCart(@CurrentUser() user: AuthenticatedUserDto) {
    return await this.cartsService.getCartByUserId(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Cart, { name: 'addItemToCart' })
  async mutationAddItemToCart(
    @CurrentUser() user: AuthenticatedUserDto,
    @Args('productVariantId', { type: () => Int }) productVariantId: number,
    @Args('quantity', { type: () => Int }) quantity: number,
  ) {
    await this.cartsService.addItemToCart(user.id, productVariantId, quantity);
    return await this.cartsService.getCartByUserId(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Cart, { name: 'updateCartItemQuantity' })
  async mutationUpdateCartItemQuantity(
    @CurrentUser() user: AuthenticatedUserDto,
    @Args('cartItemId', { type: () => Int }) cartItemId: number,
    @Args('quantity', { type: () => Int }) quantity: number,
  ) {
    await this.cartsService.updateCartItemQuantity(cartItemId, quantity);
    return await this.cartsService.getCartByUserId(user.id);
  }
}
