import { Injectable, Logger } from '@nestjs/common';
import { LLMTask } from './entities/llm-task.entity';
import { CreateLLMPromptInput } from './dto/create-llm-prompt.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { LLMTaskStatus } from 'generated/prisma/enums';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  EmbeddingJob,
  LLMTaskJobType,
  UserPromptJob,
} from './llm-task.consumer';

@Injectable()
export class LLMPromptsService {
  private readonly logger = new Logger(LLMPromptsService.name);

  private readonly DAILY_USER_TASK_LIMIT = 20;
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('llm-tasks') private readonly llmTasksQueue: Queue,
  ) {}

  async createTask(
    input: CreateLLMPromptInput,
    userId: number,
  ): Promise<LLMTask> {
    const todayUsage = await this.prisma.lLMTask.count({
      where: {
        userId: userId,
        date: new Date(),
      },
    });

    if (todayUsage >= this.DAILY_USER_TASK_LIMIT) {
      throw new Error(
        `Daily limit of ${this.DAILY_USER_TASK_LIMIT} LLM tasks reached.`,
      );
    }

    if (input.prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    const llmTask = await this.prisma.lLMTask.create({
      data: {
        prompt: input.prompt,
        userId: userId,
        status: LLMTaskStatus.PENDING,
      },
    });

    await this.addUserPromptTask({
      id: llmTask.id,
      prompt: llmTask.prompt,
      productId: input.productId,
    });

    return llmTask;
  }

  async getTaskById(id: number, userId: number): Promise<LLMTask | null> {
    const llmTask = await this.prisma.lLMTask.findUnique({
      where: { id, userId },
    });
    return llmTask ?? null;
  }

  async markTaskAsFailed(id: number, errorMessage: string) {
    await this.prisma.lLMTask.update({
      where: { id },
      data: {
        status: LLMTaskStatus.FAILED,
        response: errorMessage,
      },
    });
  }

  async markTaskAsCompleted(id: number, response: string) {
    await this.prisma.lLMTask.update({
      where: { id },
      data: {
        status: LLMTaskStatus.COMPLETED,
        response: response,
      },
    });
  }

  async cancelPrompt(id: number, userId: number): Promise<boolean> {
    const llmTask = await this.prisma.lLMTask.findUnique({
      where: { id, userId },
    });
    if (!llmTask) {
      return false;
    }
    if (llmTask.status !== LLMTaskStatus.PENDING) {
      return false;
    }
    await this.prisma.lLMTask.delete({
      where: { id },
    });

    await this.removeUserPromptTaskById(id);

    return true;
  }

  async clearLlmTasksQueue(): Promise<void> {
    await this.llmTasksQueue.drain(true);
  }

  async addUserPromptTask(data: UserPromptJob): Promise<void> {
    await this.llmTasksQueue.add(LLMTaskJobType.USER_PROMPT, data, {
      removeOnComplete: true,
      removeOnFail: true,
      jobId: this.getUserPromptTaskJobId(data.id),
    });
  }

  async addProductEmbeddingTask(data: EmbeddingJob): Promise<void> {
    await this.llmTasksQueue.add(LLMTaskJobType.PRODUCT_EMBEDDING, data, {
      removeOnComplete: true,
      removeOnFail: true,
      attempts: 3,
      priority: 5,
      jobId: this.getProductEmbeddingTaskJobId(data.productId),
    });
  }

  private getProductEmbeddingTaskJobId(productId: number): string {
    return `product-embedding-${productId}`;
  }

  private getUserPromptTaskJobId(taskId: number): string {
    return `user-prompt-${taskId}`;
  }

  async removeProductEmbeddingTask(productId: number): Promise<void> {
    await this.llmTasksQueue.remove(
      this.getProductEmbeddingTaskJobId(productId),
    );
  }

  async removeUserPromptTaskById(id: number): Promise<void> {
    await this.llmTasksQueue.remove(this.getUserPromptTaskJobId(id));
  }
}
