import { Module } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsResolver } from './product-variants.resolver';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';

@Module({
  imports: [ProductsModule],
  providers: [ProductVariantsResolver, ProductVariantsService, ProductsService],
  exports: [ProductVariantsService],
})
export class ProductVariantsModule {}
