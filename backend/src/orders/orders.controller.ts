import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  Logger,
  RawBodyRequest,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { Request, Response } from 'express';

// cmd: stripe listen --forward-to localhost:8080/orders/webhook --skip-verify
@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-checkout-session')
  async createCheckoutSession(@CurrentUser() user: AuthenticatedUserDto) {
    const url = await this.ordersService.createOrderAndCheckoutSession(user.id);

    return {
      url: url,
    };
  }

  @Post('/webhook')
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const signature = req.headers['stripe-signature'];

    if (typeof signature !== 'string') {
      this.logger.warn('Missing Stripe signature header');
      res.status(400).end();
      return;
    }

    let event;

    try {
      event = await this.ordersService.constructStripeEvent(
        req.rawBody,
        signature,
      );
    } catch (error) {
      this.logger.warn(
        `Stripe webhook error: ${error instanceof Error ? error.message : error}`,
      );
      res
        .status(400)
        .send(
          `Webhook Error: ${error instanceof Error ? error.message : error}`,
        );
      return;
    }

    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      await this.ordersService.fulfillCheckout(event.data.object.id);
    } else if (event.type === 'checkout.session.expired') {
      const orderId = parseInt(event.data.object.client_reference_id!, 10);
      if (isNaN(orderId)) {
        this.logger.warn('Invalid order ID in expired checkout session');
        res.status(400).end();
        return;
      }
      await this.ordersService.handleSessionExpired(orderId);
    }

    res.status(200).end();
  }
}
