import { Module } from '@nestjs/common';
import { ProductReviewsService } from './product-reviews.service';
import { ProductReviewsResolver } from './product-reviews.resolver';

@Module({
  providers: [ProductReviewsResolver, ProductReviewsService],
})
export class ProductReviewsModule {}
