import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoriesService } from 'src/categories/categories.service';
import { LLMPromptsModule } from 'src/llm-prompts/llm-prompts.module';
import { LLMPromptsService } from 'src/llm-prompts/llm-prompts.service';
import { LocalesModule } from 'src/locales/locales.module';
import { LocalesService } from 'src/locales/locales.service';
import { ProductVariantAttributeKeysModule } from 'src/product-variant-attribute-keys/product-variant-attribute-keys.module';
import { ProductVariantAttributeKeysService } from 'src/product-variant-attribute-keys/product-variant-attribute-keys.service';
import { ProductVariantAttributesModule } from 'src/product-variant-attributes/product-variant-attributes.module';
import { ProductVariantAttributesService } from 'src/product-variant-attributes/product-variant-attributes.service';
import { ProductVariantsModule } from 'src/product-variants/product-variants.module';
import { ProductVariantsService } from 'src/product-variants/product-variants.service';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { QdrantModule } from 'src/qdrant/qdrant.module';
import { QdrantService } from 'src/qdrant/qdrant.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ProductsModule,
    QdrantModule,
    LLMPromptsModule,
    CategoriesModule,
    ProductVariantsModule,
    ProductVariantAttributesModule,
    ProductVariantAttributeKeysModule,
    UsersModule,
    LocalesModule,
  ],
  providers: [
    ProductsService,
    ProductVariantsService,
    QdrantService,
    UsersService,
    LLMPromptsService,
    LocalesService,
    ProductVariantAttributeKeysService,
    ProductVariantAttributesService,
    CategoriesService,
    SeedService,
  ],
  exports: [SeedService],
})
export class SeedModule {}
