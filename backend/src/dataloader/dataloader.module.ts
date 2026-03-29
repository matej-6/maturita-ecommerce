import { Global, Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { LocalesModule } from 'src/locales/locales.module';
import { ProductsModule } from 'src/products/products.module';
import { ProductVariantsModule } from 'src/product-variants/product-variants.module';
import { ProductVariantAttributesModule } from 'src/product-variant-attributes/product-variant-attributes.module';
import { ProductVariantAttributeKeysModule } from 'src/product-variant-attribute-keys/product-variant-attribute-keys.module';
import { CartItemsModule } from 'src/cart-items/cart-items.module';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { ProductReviewsModule } from 'src/product-reviews/product-reviews.module';

@Global()
@Module({
  imports: [
    PrismaModule,
    CategoriesModule,
    LocalesModule,
    ProductsModule,
    ProductVariantsModule,
    ProductVariantAttributesModule,
    ProductVariantAttributeKeysModule,
    CartItemsModule,
    OrderItemsModule,
    ProductReviewsModule,
  ],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
