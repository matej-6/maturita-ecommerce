import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { LocalesModule } from 'src/locales/locales.module';
import { LocalesService } from 'src/locales/locales.service';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';

@Module({
  imports: [RedisModule, LocalesModule, ProductsModule],
  providers: [
    CategoriesResolver,
    CategoriesService,
    LocalesService,
    PrismaService,
    RedisService,
    ProductsService,
  ],
})
export class CategoriesModule {}
