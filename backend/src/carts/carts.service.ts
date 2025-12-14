import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCartItems(cartId: number) {
    return await this.prisma.cartItem.findMany({
      where: {
        cartId,
      },
    });
  }

  async getCartByUserId(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId,
      },
    });

    return cart ?? null;
  }

  async addItemToCart(
    userId: number,
    productVariantId: number,
    quantity: number,
  ) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId: userId,
        },
      });
    }

    quantity = Math.max(1, quantity);

    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productVariantId,
      },
    });

    if (existingCartItem) {
      const updatedCartItem = await this.prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
      return updatedCartItem;
    }

    const cartItem = await this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productVariantId,
        quantity,
      },
    });

    return cartItem;
  }

  async clearCart(userId: number) {
    await this.prisma.cart.deleteMany({
      where: { userId },
    });
  }

  async updateCartItemQuantity(cartItemId: number, quantity: number) {
    if (quantity < 1) {
      await this.prisma.cartItem.delete({
        where: {
          id: cartItemId,
        },
      });
      return null;
    }

    const updatedCartItem = await this.prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity: quantity,
      },
    });

    return updatedCartItem;
  }
}
