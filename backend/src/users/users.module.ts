import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { OrdersModule } from 'src/orders/orders.module';
import { OrdersService } from 'src/orders/orders.service';

@Module({
  imports: [OrdersModule],
  providers: [UsersResolver, UsersService, OrdersService],
  exports: [UsersService],
})
export class UsersModule {}
