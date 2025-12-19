import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  EmbeddingJob,
  LLMTaskJobType,
  UserPromptJob,
} from './llm-task.consumer';

@Injectable()
export class LlmService {
  constructor(
    @InjectQueue('llm-tasks') private readonly llmTasksQueue: Queue,
  ) {}

  async clearLlmTasksQueue(): Promise<void> {
    await this.llmTasksQueue.drain(true);
  }

  async addUserPromptTask(data: UserPromptJob): Promise<void> {
    await this.llmTasksQueue.add(LLMTaskJobType.USER_PROMPT, data, {
      removeOnComplete: true,
      removeOnFail: true,
      jobId: data.id.toString(),
    });
  }

  async addProductEmbeddingTask(data: EmbeddingJob): Promise<void> {
    await this.llmTasksQueue.add(LLMTaskJobType.PRODUCT_EMBEDDING, data, {
      removeOnComplete: true,
      removeOnFail: true,
      attempts: 3,
      priority: 5,
      jobId: data.productId.toString(),
    });
  }

  async removeProductEmbeddingTask(productId: number): Promise<void> {
    await this.llmTasksQueue.remove(productId.toString());
  }

  async removeTaskById(id: number): Promise<void> {
    await this.llmTasksQueue.remove(id.toString());
  }
}
