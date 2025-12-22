import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Order } from './entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { OrdersService } from './orders.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Order], { name: 'orders' })
  async findAll(@CurrentUser() user: AuthenticatedUserDto): Promise<Order[]> {
    return this.ordersService.findAllOrdersByUserId(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Order, { name: 'order', nullable: true })
  async findOne(
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
}
