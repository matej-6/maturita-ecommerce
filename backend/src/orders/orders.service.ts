import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/validate';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private stripe: Stripe;
  private nextjsUrl: string;
  private stripeWebhookSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<Env>,
  ) {
    const stripeApiKey = this.configService.get<string>('STRIPE_API_KEY')!;
    this.stripe = new Stripe(stripeApiKey);
    this.nextjsUrl = this.configService.get<string>('NEXTJS_URL')!;
    this.stripeWebhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    )!;
  }

  async createCheckoutSession(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

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

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      await tx.cart.delete({
        where: { id: cart.id },
      });
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
      payment_method_types: ['card', 'link'],
      phone_number_collection: {
        enabled: true,
      },
      automatic_tax: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['SK', 'CZ', 'PL', 'HU', 'AT', 'DE'],
      },
      billing_address_collection: 'required',
      customer_email: user.email,
      line_items: cart.CartItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: item.ProductVariant.priceInCents,
          product_data: {
            name: item.ProductVariant.sku,
          },
        },
      })),
      mode: 'payment',
      success_url: `${this.nextjsUrl}/checkout/success?orderId=${order.id}`,
    });

    return session.url;
  }

  async fulfillCheckout(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    const orderId = parseInt(session.client_reference_id || '', 10);
    if (isNaN(orderId)) {
      throw new Error('Invalid order ID in client_reference_id');
    }
    if (session.payment_status !== 'unpaid') {
      const shippingDetails = session.collected_information?.shipping_details;

      const order = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: shippingDetails ? 'PROCESSING' : 'FAILED',
          shippingDetails: shippingDetails
            ? {
                create: {
                  city: shippingDetails.address.city,
                  country: shippingDetails.address.country!,
                  line1: shippingDetails.address.line1!,
                  name: shippingDetails.name,
                  postalCode: shippingDetails.address.postal_code!,
                  state: shippingDetails.address.state,
                  line2: shippingDetails.address.line2,
                },
              }
            : undefined,
        },
      });

      return order;
    }
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

  async constructStripeEvent(payload: any, signature: string) {
    this.logger.log('Constructing Stripe event from webhook payload');
    this.logger.log(`Payload: ${payload}`);

    return this.stripe.webhooks.constructEventAsync(
      payload,
      signature,
      this.stripeWebhookSecret,
    );
  }
}
