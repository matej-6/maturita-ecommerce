import { Module } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsResolver } from './product-variants.resolver';

@Module({
  providers: [ProductVariantsResolver, ProductVariantsService],
  exports: [ProductVariantsService],
})
export class ProductVariantsModule {}
