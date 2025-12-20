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

@Module({
  imports: [LocalesModule, LLMPromptsModule, QdrantModule],
  providers: [
    ProductsResolver,
    ProductsService,
    PrismaService,
    LocalesService,
    LLMPromptsService,
    QdrantService,
  ],
  exports: [ProductsService, QdrantService, LLMPromptsService],
})
export class ProductsModule {}
