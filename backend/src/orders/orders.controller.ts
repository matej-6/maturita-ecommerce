import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { Request, Response } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-checkout-session')
  createCheckoutSession(@CurrentUser() user: AuthenticatedUserDto) {
    return this.ordersService.createCheckoutSession(user.id);
  }

  @Post()
  async stripeWebhook(
    @Body() body: unknown,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const signature = req.headers['stripe-signature'];

    if (typeof signature !== 'string') {
      res.status(400).end();
      return;
    }

    let event;

    try {
      event = await this.ordersService.constructStripeEvent(body, signature);
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const orderId = event.data.object.client_reference_id || null;
      if (!orderId) {
        res.status(400).end();
        return;
      }
      await this.ordersService.fulfillCheckout(parseInt(orderId, 10));
    } else if (event.type === 'checkout.session.async_payment_failed') {
      // await this.ordersService.handleFailedPayment(event.data.object.id);
    }

    res.status(200).end();
  }
}
