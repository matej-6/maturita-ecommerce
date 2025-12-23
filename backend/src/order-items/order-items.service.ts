import { Injectable, Logger } from '@nestjs/common';
import { ProductVariant } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderItemsService {
  private readonly logger = new Logger(OrderItemsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAllByOrderId(orderId: number) {
    return this.prisma.orderItem.findMany({
      where: { orderId },
    });
  }

  async getProductVariantsByBatch(
    orderItemIds: number[],
  ): Promise<(ProductVariant | null)[]> {
    const orderItems = await this.prisma.orderItem.findMany({
      where: { id: { in: orderItemIds } },
      include: { ProductVariant: true },
    });

    return orderItemIds.map((id) => {
      const item = orderItems.find((oi) => oi.id === id);
      return item ? item.ProductVariant : null;
    });
  }
}
