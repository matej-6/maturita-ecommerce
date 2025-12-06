import { Module } from '@nestjs/common';
import { ProductVariantAttributesService } from './product-variant-attributes.service';
import { ProductVariantAttributesResolver } from './product-variant-attributes.resolver';

@Module({
  providers: [
    ProductVariantAttributesResolver,
    ProductVariantAttributesService,
  ],
  exports: [ProductVariantAttributesService],
})
export class ProductVariantAttributesModule {}
