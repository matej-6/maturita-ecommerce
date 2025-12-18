import { Module } from '@nestjs/common';
import { LLMPromptsService } from './llm-prompts.service';
import { LLMPromptsResolver } from './llm-prompts.resolver';
import { BullModule } from '@nestjs/bullmq';
import { LLMTaskConsumer } from 'src/llm/llm-task.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'llm-tasks',
    }),
  ],
  providers: [LLMPromptsResolver, LLMPromptsService, LLMTaskConsumer],
})
export class LLMPromptsModule {}
