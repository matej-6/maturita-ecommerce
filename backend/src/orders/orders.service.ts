import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class OrdersService {
  private stripe: Stripe;
  private nextjsUrl: string;
  private stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  constructor(private readonly prisma: PrismaService) {
    const stripeApiKey = process.env.STRIPE_API_KEY;
    if (!stripeApiKey) {
      throw new Error('STRIPE_API_KEY is not defined in environment variables');
    }
    this.stripe = new Stripe(stripeApiKey);
    this.nextjsUrl = process.env.NEXTJS_URL!;
    if (!this.nextjsUrl) {
      throw new Error('NEXTJS_URL is not defined in environment variables');
    }

    if (!this.stripeWebhookSecret) {
      throw new Error(
        'STRIPE_WEBHOOK_SECRET is not defined in environment variables',
      );
    }
  }

  async createCheckoutSession(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        CartItems: {
          select: {
            quantity: true,
            ProductVariant: {
              select: {
                id: true,
                priceInCents: true,
                sku: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.CartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const order = await this.prisma.$transaction(async (tx) => {
      let total = 0;
      for (const item of cart.CartItems) {
        if (item.quantity > item.ProductVariant.stock) {
          throw new Error(
            `Insufficient stock for product variant ID ${item.ProductVariant.id}`,
          );
        }
        total += item.quantity * item.ProductVariant.priceInCents;
        await tx.productVariant.update({
          where: { id: item.ProductVariant.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
      return await tx.order.create({
        data: {
          totalInCents: total,
          userId: userId,
          orderItems: {
            createMany: {
              data: cart.CartItems.map((item) => ({
                productVariantId: item.ProductVariant.id,
                quantity: item.quantity,
                unitPriceInCents: item.ProductVariant.priceInCents,
                sku: item.ProductVariant.sku,
              })),
            },
          },
        },
      });
    });

    const session = await this.stripe.checkout.sessions.create({
      client_reference_id: order.id.toString(),
      line_items: cart.CartItems.map((item) => ({
        price_data: {
          currency: 'eur',
          unit_amount: item.ProductVariant.priceInCents,
          product_data: {
            name: item.ProductVariant.sku,
          },
        },
      })),
      mode: 'payment',
      success_url: `${this.nextjsUrl}/checkout/success`,
    });

    return session.url;
  }

  async fulfillCheckout(orderId: number) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PROCESSING',
      },
    });

    return order;
  }

  async cancelOrder(orderId: number) {
    await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELED',
        },
        include: {
          orderItems: true,
        },
      });

      for (const item of order.orderItems.filter(
        (oi) => oi.productVariantId != null,
      )) {
        await tx.productVariant.update({
          where: { id: item.productVariantId! },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return order;
    });
  }

  async constructStripeEvent(payload: unknown, signature: string) {
    return this.stripe.webhooks.constructEventAsync(
      payload as string | Buffer,
      signature,
      this.stripeWebhookSecret,
    );
  }
}
