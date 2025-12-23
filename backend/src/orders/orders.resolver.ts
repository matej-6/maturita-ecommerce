import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Order } from './entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { OrdersService } from './orders.service';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { OrderItemsService } from 'src/order-items/order-items.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderItemsService: OrderItemsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Order], { name: 'orders' })
  async findAllForUser(
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<Order[]> {
    return this.ordersService.findAllOrdersByUserId(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Order, { name: 'order', nullable: true })
  async findOneForUser(
    id: number,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<Order | null> {
    return this.ordersService.findOrderByIdAndUserId(id, user.id);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard)
  async cancelOrder(
    id: number,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<Order> {
    return this.ordersService.cancelOrder(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ResolveField(() => [OrderItem], { name: 'items' })
  async resolveOrderItems(@Parent() order: Order) {
    return this.orderItemsService.findAllByOrderId(order.id);
  }
}
