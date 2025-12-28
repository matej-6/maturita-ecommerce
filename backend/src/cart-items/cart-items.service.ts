import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartItemsService {
  private readonly logger = new Logger(CartItemsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getProductVariantsByBatch(cartItemIds: number[]) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        id: { in: cartItemIds },
      },
      include: {
        ProductVariant: true,
      },
    });

    this.logger.debug(
      `Fetched ProductVariants for CartItem IDs: ${cartItemIds.join(', ')}`,
    );

    return cartItemIds.map((id) => {
      const cartItem = cartItems.find((ci) => ci.id === id);
      return cartItem ? cartItem.ProductVariant : null;
    });
  }
}
