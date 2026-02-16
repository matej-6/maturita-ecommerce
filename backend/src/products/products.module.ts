import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { LocalesModule } from 'src/locales/locales.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocalesService } from 'src/locales/locales.service';
import { LLMPromptsModule } from 'src/llm-prompts/llm-prompts.module';
import { LLMPromptsService } from 'src/llm-prompts/llm-prompts.service';
import { QdrantModule } from 'src/qdrant/qdrant.module';
import { QdrantService } from 'src/qdrant/qdrant.service';
import { ProductsController } from './products.controller';
import { ImageStorageModule } from 'src/image-storage/image-storage.module';
import { ImageStorageService } from 'src/image-storage/image-storage.service';
import { ProductVariantsService } from 'src/product-variants/product-variants.service';
import { ProductVariantsModule } from 'src/product-variants/product-variants.module';

@Module({
  imports: [
    LocalesModule,
    LLMPromptsModule,
    QdrantModule,
    ImageStorageModule,
    ProductVariantsModule,
  ],
  providers: [
    ProductsResolver,
    ProductsService,
    PrismaService,
    LocalesService,
    LLMPromptsService,
    QdrantService,
    ImageStorageService,
    ProductVariantsService,
  ],
  exports: [
    ProductsService,
    QdrantService,
    LLMPromptsService,
    ImageStorageService,
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
