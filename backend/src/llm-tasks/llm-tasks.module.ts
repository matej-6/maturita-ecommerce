import { Module } from '@nestjs/common';
import { LlmTasksService } from './llm-tasks.service';
import { LlmTasksResolver } from './llm-tasks.resolver';

@Module({
  providers: [LlmTasksResolver, LlmTasksService],
})
export class LlmTasksModule {}
