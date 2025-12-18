import { Module } from '@nestjs/common';
import { LlmTasksService } from './llm-tasks.service';
import { LlmTasksResolver } from './llm-tasks.resolver';
import { LLMTaskConsumer } from './llm-task.consumer';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'llm-tasks',
    }),
  ],
  providers: [LlmTasksResolver, LlmTasksService, LLMTaskConsumer],
})
export class LlmTasksModule {}
