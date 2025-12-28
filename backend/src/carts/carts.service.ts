import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import { ERROR } from 'src/errors';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CartsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCartItems(cartId: number) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cartId,
      },
    });

    return cartItems;
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
      try {
        await this.prisma.cartItem.delete({
          where: {
            id: cartItemId,
          },
        });
      } catch (e) {
        this.logger.warn('Failed to delete cart item', e);
        if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
          return null;
        }
        throw new InternalServerErrorException(ERROR.unknownError);
      }
      return null;
    }

    try {
      const updatedCartItem = await this.prisma.cartItem.update({
        where: {
          id: cartItemId,
        },
        data: {
          quantity: quantity,
        },
      });

      return updatedCartItem;
    } catch (e) {
      this.logger.warn('Failed to update cart item quantity', e);
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new BadRequestException(ERROR.badRequest);
      }
      throw new InternalServerErrorException(ERROR.unknownError);
    }
  }
}
