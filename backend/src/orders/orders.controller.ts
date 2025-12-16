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
    const url = this.ordersService.createCheckoutSession(user.id);

    return {
      url: url,
    };
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
      await this.ordersService.fulfillCheckout(event.data.object.id);
    } else if (event.type === 'checkout.session.expired') {
      const orderId = parseInt(event.data.object.client_reference_id!, 10);
      if (isNaN(orderId)) {
        res.status(400).end();
        return;
      }
      await this.ordersService.cancelOrder(orderId);
    }

    res.status(200).end();
  }
}
