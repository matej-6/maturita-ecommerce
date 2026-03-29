import { Module } from '@nestjs/common';
import { ProductReviewsService } from './product-reviews.service';
import { ProductReviewsResolver } from './product-reviews.resolver';
import { ProductsModule } from 'src/products/products.module';
import { ProductVariantsModule } from 'src/product-variants/product-variants.module';
import { ImageStorageModule } from 'src/image-storage/image-storage.module';

@Module({
  imports: [ProductsModule, ProductVariantsModule, ImageStorageModule],
  providers: [ProductReviewsResolver, ProductReviewsService],
  exports: [ProductReviewsService],
})
export class ProductReviewsModule {}
