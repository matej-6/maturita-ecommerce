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
    lang: string,
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

    const existingJob = await this.llmTasksQueue.getJob(
      this.getUserPromptTaskJobIdByUserId(userId),
    );
    if (existingJob) {
      throw new Error('Please wait for your previous prompt to finish.');
    }
    const llmTask = await this.prisma.lLMTask.create({
      data: {
        prompt: input.prompt,
        userId: userId,
        status: LLMTaskStatus.PENDING,
        lang: lang,
      },
    });

    try {
      await this.addUserPromptTask({
        id: llmTask.id,
        prompt: llmTask.prompt,
        productId: input.productId,
        userId: userId,
        lang: lang,
      });

      return {
        ...llmTask,
        response: null,
      };
    } catch (error) {
      this.logger.error(error.message);
      const res = await this.prisma.lLMTask.update({
        where: {
          id: llmTask.id,
        },
        data: {
          status: LLMTaskStatus.FAILED,
          response: {
            create: {
              text: 'Failed to enqueue LLM task.',
            },
          },
        },
        include: {
          response: {
            include: {
              products: true,
            },
          },
        },
      });
      return {
        ...res,
        response: res.response
          ? {
              id: res.response.id,
              text: res.response.text,
              products:
                res.response.products.map((p) => ({
                  ...p,
                  isSetup: true,
                })) || null,
            }
          : null,
      };
    }
  }

  async getTaskById(id: number, userId: number): Promise<LLMTask | null> {
    const llmTask = await this.prisma.lLMTask.findUnique({
      where: { id, userId },
      include: {
        response: {
          include: {
            products: true,
          },
        },
      },
    });
    return llmTask
      ? {
          ...llmTask,
          response: llmTask.response
            ? {
                id: llmTask.response.id,
                text: llmTask.response.text,
                products:
                  llmTask.response.products.map((p) => ({
                    ...p,
                    isSetup: true,
                  })) || null,
              }
            : null,
        }
      : null;
  }

  async markTaskAsFailed(id: number, errorMessage: string) {
    await this.prisma.lLMTask.update({
      where: { id },
      data: {
        status: LLMTaskStatus.FAILED,
        response: { create: { text: errorMessage } },
      },
    });
  }

  async markTaskAsCompleted(
    id: number,
    response: string,
    productIds?: number[],
  ) {
    await this.prisma.lLMTask.update({
      where: { id },
      data: {
        status: LLMTaskStatus.COMPLETED,
        response: {
          create: {
            text: response,
            products: productIds
              ? {
                  connect: productIds.map((pid) => ({ id: pid })),
                }
              : undefined,
          },
        },
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

    await this.removeUserPromptTaskByUserId(userId);

    return true;
  }

  async clearLlmTasksQueue(): Promise<void> {
    await this.llmTasksQueue.drain(true);
  }

  async addUserPromptTask(data: UserPromptJob): Promise<void> {
    await this.llmTasksQueue.add(LLMTaskJobType.USER_PROMPT, data, {
      removeOnComplete: true,
      removeOnFail: true,
      jobId: this.getUserPromptTaskJobIdByUserId(data.userId),
    });
  }

  async addProductEmbeddingTask(data: EmbeddingJob) {
    const newEmbeddingTask = await this.prisma.embeddingTask.create({
      data: {
        productId: data.productId,
        lang: data.lang,
        status: LLMTaskStatus.PENDING,
      },
    });

    await this.llmTasksQueue.add(LLMTaskJobType.PRODUCT_EMBEDDING, data, {
      removeOnComplete: true,
      removeOnFail: true,
      attempts: 3,
      priority: 5,
      jobId: this.getProductEmbeddingTaskJobId(newEmbeddingTask.id, data.lang),
    });

    return newEmbeddingTask;
  }

  async addProductContentEmbeddingTask(data: EmbeddingJob) {
    const newContentTask = await this.prisma.productContentEmbeddingTask.create(
      {
        data: {
          productId: data.productId,
          lang: data.lang,
          status: LLMTaskStatus.PENDING,
        },
      },
    );

    await this.llmTasksQueue.add(
      LLMTaskJobType.PRODUCT_CONTENT_EMBEDDING,
      data,
      {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
        priority: 5,
        jobId: this.getProductContentEmbeddingTaskJobId(
          newContentTask.id,
          data.lang,
        ),
      },
    );

    return newContentTask;
  }

  private getProductContentEmbeddingTaskJobId(
    taskId: number,
    lang: string,
  ): string {
    return `product-content-embedding-${taskId}-${lang}`;
  }

  private getProductEmbeddingTaskJobId(
    productId: number,
    lang: string,
  ): string {
    return `product-embedding-${productId}-${lang}`;
  }

  private getUserPromptTaskJobIdByUserId(taskId: number): string {
    return `user-prompt-${taskId}`;
  }

  async removeProductEmbeddingTask(
    productId: number,
    lang: string,
  ): Promise<void> {
    const task = await this.prisma.embeddingTask.findUnique({
      where: { productId_lang: { productId: productId, lang: lang } },
    });

    if (!task) {
      return;
    }

    await this.llmTasksQueue.remove(
      this.getProductEmbeddingTaskJobId(task.id, lang),
    );
  }

  async removeProductContentEmbeddingTask(
    productId: number,
    lang: string,
  ): Promise<void> {
    const task = await this.prisma.productContentEmbeddingTask.findUnique({
      where: { productId_lang: { productId: productId, lang: lang } },
    });

    if (!task) {
      return;
    }
    await this.llmTasksQueue.remove(
      this.getProductContentEmbeddingTaskJobId(task.id, lang),
    );
  }

  async removeUserPromptTaskByUserId(id: number): Promise<void> {
    await this.llmTasksQueue.remove(this.getUserPromptTaskJobIdByUserId(id));
  }
}
