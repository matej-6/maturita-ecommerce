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
import { ProductVariantAttributesModule } from 'src/product-variant-attributes/product-variant-attributes.module';
import { ProductVariantAttributesService } from 'src/product-variant-attributes/product-variant-attributes.service';
import { ProductVariantsService } from 'src/product-variants/product-variants.service';
import { ProductVariantsModule } from 'src/product-variants/product-variants.module';

@Module({
  imports: [
    RedisModule,
    LocalesModule,
    ProductsModule,
    ProductVariantsModule,
    ProductVariantAttributesModule,
  ],
  providers: [
    CategoriesResolver,
    CategoriesService,
    LocalesService,
    PrismaService,
    RedisService,
    ProductsService,
    ProductVariantsService,
    ProductVariantAttributesService,
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
