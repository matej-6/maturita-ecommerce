import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Order, PaginatedOrder } from './entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { OrdersService } from './orders.service';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { OrderShippingDetails } from './entities/shipping-details.entity';
import { PaginationArgs } from 'src/lib/pagination.args';
import { OrderFindAllQueryArgs, OrderSortingArgs } from './order.resolver.args';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UpdateOrderDto } from './dto/update-order.dto';

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
  @Query(() => PaginatedOrder, { name: 'findAllPaginatedOrders' })
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args() findAllQueryArgs: OrderFindAllQueryArgs,
    @Args() sortByArgs: OrderSortingArgs,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<PaginatedOrder> {
    return this.ordersService.findAllPaginated(
      paginationArgs,
      findAllQueryArgs,
      sortByArgs,
      user,
    );
  }

  @UseGuards(AdminGuard)
  @Query(() => Order, { name: 'findOrderById', nullable: true })
  async findOrderById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Order | null> {
    return this.ordersService.findOrderById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Order, { name: 'order', nullable: true })
  async findOneForUser(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<Order | null> {
    return this.ordersService.findOrderByIdAndUserId(id, user.id);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard)
  async cancelOrder(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<Order> {
    return this.ordersService.cancelOrder(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ResolveField(() => [OrderItem], { name: 'items' })
  async resolveOrderItems(@Parent() order: Order) {
    return this.orderItemsService.findAllByOrderId(order.id);
  }

  @ResolveField(() => OrderShippingDetails, {
    nullable: true,
    name: 'shippingDetails',
  })
  async resolveShippingDetails(
    @Parent() order: Order,
  ): Promise<OrderShippingDetails | null> {
    return await this.ordersService.getOrderShippingDetails(order.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String, { name: 'retryPendingPayment' })
  async retryPendingPayment(
    @Args('orderId', { type: () => Int }) orderId: number,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<string> {
    return await this.ordersService.retryPendingCheckout(orderId, user.id);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Boolean, { name: 'updateOrder' })
  async updateOrder(
    @Args('orderId', { type: () => Int }) orderId: number,
    @Args('input', { type: () => UpdateOrderDto }) input: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(orderId, input);
  }
}
