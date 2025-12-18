import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LlmTasksService } from './llm-tasks.service';

export type LLMTaskJob = {
  id: number;
  prompt: string;
  productId?: number;
};

@Processor('llm-tasks')
export class LLMTaskConsumer extends WorkerHost {
  constructor(private readonly llmTasksService: LlmTasksService) {
    super();
  }

  async process(job: Job<LLMTaskJob, any, string>): Promise<any> {
    await this.llmTasksService.consumeLlmTask(job.data);
  }
}
