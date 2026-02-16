import { Module } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsResolver } from './product-variants.resolver';
import { QdrantModule } from 'src/qdrant/qdrant.module';
import { QdrantService } from 'src/qdrant/qdrant.service';
import { LLMPromptsModule } from 'src/llm-prompts/llm-prompts.module';
import { LLMPromptsService } from 'src/llm-prompts/llm-prompts.service';
import { ImageStorageModule } from 'src/image-storage/image-storage.module';
import { ImageStorageService } from 'src/image-storage/image-storage.service';
import { ProductVariantsController } from './product-variants.controller';

@Module({
  imports: [QdrantModule, LLMPromptsModule, ImageStorageModule],
  providers: [
    ProductVariantsResolver,
    ProductVariantsService,
    QdrantService,
    LLMPromptsService,
    ImageStorageService,
  ],
  exports: [ProductVariantsService],
  controllers: [ProductVariantsController],
})
export class ProductVariantsModule {}
