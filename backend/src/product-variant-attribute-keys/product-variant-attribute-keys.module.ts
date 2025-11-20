import { Module } from '@nestjs/common';
import { ProductVariantAttributeKeysService } from './product-variant-attribute-keys.service';
import { ProductVariantAttributeKeysResolver } from './product-variant-attribute-keys.resolver';

@Module({
  providers: [
    ProductVariantAttributeKeysResolver,
    ProductVariantAttributeKeysService,
  ],
  exports: [ProductVariantAttributeKeysService],
})
export class ProductVariantAttributeKeysModule {}
