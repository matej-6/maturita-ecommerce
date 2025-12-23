import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersResolver } from './orders.resolver';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { OrderItemsService } from 'src/order-items/order-items.service';

@Module({
  imports: [OrderItemsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersResolver, OrderItemsService],
  exports: [OrdersService],
})
export class OrdersModule {}
