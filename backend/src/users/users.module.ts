import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { OrdersModule } from 'src/orders/orders.module';
import { OrdersService } from 'src/orders/orders.service';
import { ImageStorageModule } from 'src/image-storage/image-storage.module';
import { ImageStorageService } from 'src/image-storage/image-storage.service';
import { UsersController } from './users.controller';

@Module({
  imports: [OrdersModule, ImageStorageModule],
  providers: [UsersResolver, UsersService, OrdersService, ImageStorageService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
