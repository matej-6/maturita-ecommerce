import { Module } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsResolver } from './product-variants.resolver';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { QdrantModule } from 'src/qdrant/qdrant.module';
import { QdrantService } from 'src/qdrant/qdrant.service';
import { LLMPromptsModule } from 'src/llm-prompts/llm-prompts.module';
import { LLMPromptsService } from 'src/llm-prompts/llm-prompts.service';

@Module({
  imports: [ProductsModule, QdrantModule, LLMPromptsModule],
  providers: [
    ProductVariantsResolver,
    ProductVariantsService,
    ProductsService,
    QdrantService,
    LLMPromptsService,
  ],
  exports: [ProductVariantsService],
})
export class ProductVariantsModule {}
