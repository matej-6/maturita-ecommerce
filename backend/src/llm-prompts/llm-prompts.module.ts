import { Module } from '@nestjs/common';
import { LLMPromptsService } from './llm-prompts.service';
import { LLMPromptsResolver } from './llm-prompts.resolver';
import { BullConfigModule } from 'src/bull-config/bull-config.module';
import { LLMTaskConsumer } from './llm-task.consumer';
import { QdrantModule } from 'src/qdrant/qdrant.module';
import { QdrantService } from 'src/qdrant/qdrant.service';

@Module({
  imports: [BullConfigModule, QdrantModule],
  providers: [
    LLMPromptsResolver,
    LLMPromptsService,
    LLMTaskConsumer,
    QdrantService,
  ],
  exports: [LLMPromptsService, QdrantService],
})
export class LLMPromptsModule {}
