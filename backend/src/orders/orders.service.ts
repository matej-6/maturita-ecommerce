import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order, OrderShippingDetails } from 'generated/prisma/client';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { Env } from 'src/config/validate';
import { PaginationArgs } from 'src/lib/pagination.args';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
import { OrderFindAllQueryArgs } from './order.resolver.args';
import { SortingArgs } from 'src/args/sorting-args';
import { PaginatedOrder } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ERROR } from 'src/errors';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';

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

  async findAllOrdersByUserId(userId: number): Promise<Order[]> {
    const res = await this.prisma.order.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });

    for (let i = 0; i < res.length; i++) {
      if (res[i].status === 'PENDING') {
        try {
          const syncedOrder = await this.syncOrderStatusWithStripe(res[i].id);
          if (syncedOrder) {
            res[i] = syncedOrder;
          }
        } catch (e) {
          this.logger.error(
            `Failed to sync order status with Stripe for order ID ${res[i].id}: ${e}`,
          );
        }
      }
    }
    return res;
  }

  async findOrderByIdAndUserId(
    id: number,
    userId: number,
  ): Promise<Order | null> {
    let res = await this.prisma.order.findFirst({
      where: { id: id, userId: userId },
    });

    if (res?.status === 'PENDING') {
      try {
        const syncedOrder = await this.syncOrderStatusWithStripe(id);
        if (syncedOrder) {
          res = syncedOrder;
        }
      } catch (e) {
        this.logger.error(
          `Failed to sync order status with Stripe for order ID ${id}: ${e}`,
        );
      }
    }
    return res;
  }

  async findOrderById(id: number): Promise<Order | null> {
    let res = await this.prisma.order.findUnique({
      where: { id: id },
    });

    if (res?.status === 'PENDING') {
      try {
        const syncedOrder = await this.syncOrderStatusWithStripe(id);
        if (syncedOrder) {
          res = syncedOrder;
        }
      } catch (e) {}
    }
    return res;
  }

  async updateOrder(orderId: number, input: UpdateOrderDto) {
    const updatedOrder = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: input.status,
      },
    });

    return updatedOrder;
  }

  private async syncOrderStatusWithStripe(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new Error('Order not found or missing session ID');
    }

    if (!order.StripePaymentIntentId) {
      throw new Error('Order does not have a Stripe Payment Intent ID');
    }

    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      order.StripePaymentIntentId,
    );

    if (
      paymentIntent.status === 'succeeded' &&
      (order.status === 'PENDING' || order.status === 'FAILED')
    ) {
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PROCESSING',
          shippingDetails: {
            create: {
              city: paymentIntent.shipping?.address?.city || '',
              country: paymentIntent.shipping?.address?.country || '',
              line1: paymentIntent.shipping?.address?.line1 || '',
              name: paymentIntent.shipping?.name || '',
              postalCode: paymentIntent.shipping?.address?.postal_code || '',
              state: paymentIntent.shipping?.address?.state || '',
              line2: paymentIntent.shipping?.address?.line2 || '',
              phone: paymentIntent.shipping?.phone || '',
            },
          },
        },
      });

      return updatedOrder;
    }
  }

  async createOrderAndCheckoutSession(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException(ERROR.badRequest);
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
      throw new BadRequestException('orders.service.cartIsEmpty');
    }

    const order = await this.prisma.$transaction(async (tx) => {
      let total = 0;
      for (const item of cart.CartItems) {
        if (item.quantity > item.ProductVariant.stock) {
          throw new BadRequestException('orders.service.insufficientStock');
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
        include: {
          orderItems: {
            include: {
              ProductVariant: true,
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
      line_items: order.orderItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: item.ProductVariant!.priceInCents,
          product_data: {
            name: item.ProductVariant!.sku,
          },
        },
      })),
      mode: 'payment',
      success_url: `${this.nextjsUrl}/account/orders/${order.id}`,
      cancel_url: `${this.nextjsUrl}/account/orders/${order.id}`,
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        StripeSessionId: session.id,
        StripePaymentIntentId: session.payment_intent as string,
      },
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

      const o = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (
        o?.status === 'PROCESSING' ||
        o?.status === 'SHIPPED' ||
        o?.status === 'DELIVERED'
      ) {
        return o;
      }

      const order = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PROCESSING',
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
                  phone: session.customer_details?.phone,
                },
              }
            : undefined,
        },
      });

      return order;
    }
  }

  async retryPendingCheckout(orderId: number, userId: number) {
    try {
      await this.syncOrderStatusWithStripe(orderId);
    } catch (error) {}
    const order = await this.prisma.order.findUnique({
      where: { id: orderId, userId: userId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new BadRequestException('orders.service.orderNotFound');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        'orders.service.onlyPendingOrdersCanBeRetried',
      );
    }

    const session = await this.stripe.checkout.sessions.retrieve(
      order.StripeSessionId!,
    );

    if (session.status === 'expired') {
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'FAILED',
        },
      });
      throw new BadRequestException('orders.service.checkoutSessionExpired');
    }

    if (!session.url) {
      this.logger.error(
        `Stripe session for order ID ${orderId} does not have a URL`,
      );
      throw new InternalServerErrorException(ERROR.unknownError);
    }

    return session.url;
  }

  async handleSessionExpired(orderId: number) {
    await this.syncOrderStatusWithStripe(orderId);

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || !order.StripeSessionId) {
      this.logger.error(
        `Order not found or missing Stripe session ID for order ID ${orderId}`,
      );
      throw new Error('Order not found or missing session ID');
    }

    if (order.status === 'PENDING') {
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'FAILED',
        },
      });
    }
  }

  async cancelOrder(orderId: number, userId: number): Promise<Order> {
    try {
      await this.syncOrderStatusWithStripe(orderId);
    } catch (error) {}

    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId: userId },
    });

    if (!order) {
      throw new Error('orders.service.orderNotFound');
    }

    if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
      throw new Error(
        'orders.service.onlyPendingOrProcessingOrdersCanBeCanceled',
      );
    }

    const session = await this.stripe.checkout.sessions.retrieve(
      order.StripeSessionId!,
    );

    if (session.payment_status === 'paid') {
      const res = await this.prisma.$transaction(async (tx) => {
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
          try {
            await tx.productVariant.update({
              where: { id: item.productVariantId! },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          } catch (error) {
            this.logger.error(
              `Failed to restock product variant ID ${item.productVariantId} for order ID ${orderId}: ${error}`,
            );
          }
        }

        return order;
      });
      await this.stripe.refunds.create({
        payment_intent: order.StripePaymentIntentId!,
      });
      return res;
    } else {
      await this.stripe.checkout.sessions.expire(order.StripeSessionId!);
      const res = await this.prisma.$transaction(async (tx) => {
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
          try {
            await tx.productVariant.update({
              where: { id: item.productVariantId! },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          } catch (error) {
            this.logger.error(
              `Failed to restock product variant ID ${item.productVariantId} for order ID ${orderId}: ${error}`,
            );
          }
        }

        return order;
      });
      return res;
    }
  }

  async constructStripeEvent(payload: any, signature: string) {
    return this.stripe.webhooks.constructEventAsync(
      payload,
      signature,
      this.stripeWebhookSecret,
    );
  }

  async getOrderShippingDetails(
    id: number,
  ): Promise<OrderShippingDetails | null> {
    try {
      return this.prisma.orderShippingDetails.findUnique({
        where: {
          id: id,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(ERROR.badRequest);
      } else {
        throw new InternalServerErrorException(ERROR.unknownError);
      }
    }
  }

  private validatePaginationArgs(args: PaginationArgs) {
    if (args.cursor != null) {
      args.cursor = Math.abs(args.cursor);
    }
    args.pageSize = Math.min(Math.abs(args.pageSize), 25);
  }

  private validateFindAllQueryArgs(
    queryArgs: OrderFindAllQueryArgs,
    user: AuthenticatedUserDto,
  ) {
    if (user.role !== 'ADMIN') {
      queryArgs.userId = user.id;
    }
  }

  private validateSortingArgs(args: SortingArgs) {
    const validSortByFields = [
      'createdAt',
      'updatedAt',
      'id',
      'userId',
      'totalInCents',
      'status',
      null,
    ];
    if (!validSortByFields.includes(args.sortBy)) {
      args.sortBy = null;
    }
  }

  async findAllPaginated(
    paginationArgs: PaginationArgs,
    findAllQueryArgs: OrderFindAllQueryArgs,
    sortByArgs: SortingArgs,
    user: AuthenticatedUserDto,
  ): Promise<PaginatedOrder> {
    this.validatePaginationArgs(paginationArgs);
    this.validateFindAllQueryArgs(findAllQueryArgs, user);
    this.validateSortingArgs(sortByArgs);

    const res = await this.prisma.order.findMany({
      where: {
        userId: findAllQueryArgs.userId ?? undefined,
        status: findAllQueryArgs.status ?? undefined,
        id: findAllQueryArgs.id ?? undefined,
        totalInCents: {
          gte: findAllQueryArgs.minPrice ?? undefined,
          lte: findAllQueryArgs.maxPrice ?? undefined,
        },
        createdAt: {
          gte: findAllQueryArgs.dateFrom ?? undefined,
          lte: findAllQueryArgs.dateTo ?? undefined,
        },
      },
      take: paginationArgs.pageSize + 1,
      cursor:
        paginationArgs.cursor != null
          ? { id: paginationArgs.cursor }
          : undefined,
      orderBy:
        sortByArgs.sortBy != null
          ? { [sortByArgs.sortBy]: sortByArgs.ascending ? 'asc' : 'desc' }
          : { createdAt: 'desc' },
    });

    const hasNextPage = res.length > paginationArgs.pageSize;
    if (hasNextPage) {
      res.pop();
    }

    return {
      hasNextPage,
      totalCount: res.length,
      edges: res.map((order) => ({
        cursor: order.id,
        node: order,
      })),
    };
  }
}
