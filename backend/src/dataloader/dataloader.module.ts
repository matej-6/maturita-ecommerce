import { Global, Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoriesService } from 'src/categories/categories.service';
import { LocalesModule } from 'src/locales/locales.module';
import { LocalesService } from 'src/locales/locales.service';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { ProductVariantsModule } from 'src/product-variants/product-variants.module';
import { ProductVariantsService } from 'src/product-variants/product-variants.service';
import { ProductVariantAttributesModule } from 'src/product-variant-attributes/product-variant-attributes.module';
import { ProductVariantAttributesService } from 'src/product-variant-attributes/product-variant-attributes.service';
import { ProductVariantAttributeKeysModule } from 'src/product-variant-attribute-keys/product-variant-attribute-keys.module';
import { ProductVariantAttributeKeysService } from 'src/product-variant-attribute-keys/product-variant-attribute-keys.service';

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
  ],
  providers: [
    DataloaderService,
    CategoriesService,
    LocalesService,
    ProductsService,
    ProductVariantsService,
    ProductVariantAttributesService,
    ProductVariantAttributeKeysService,
  ],
  exports: [DataloaderService],
})
export class DataloaderModule {}
