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
import { I18nContext } from 'nestjs-i18n';
import { ERROR } from 'src/errors';

@Injectable()
export class LLMPromptsService {
  private readonly logger = new Logger(LLMPromptsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('llm-tasks') private readonly llmTasksQueue: Queue,
  ) {}

  async createTask(
    input: CreateLLMPromptInput,
    userId: number,
    lang: string,
  ): Promise<LLMTask> {
    if (input.prompt.trim().length === 0) {
      throw new Error('llm.service.emptyPrompt');
    }

    const existingJob = await this.llmTasksQueue.getJob(
      this.getUserPromptTaskJobIdByUserId(userId),
    );
    if (existingJob) {
      throw new Error('llm.service.existingJob');
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
      this.logger.error(
        `Failed to enqueue LLM task: ${error instanceof Error ? error.message : String(error)}`,
      );

      const i18n = I18nContext.current();

      const res = await this.prisma.lLMTask.update({
        where: {
          id: llmTask.id,
        },
        data: {
          status: LLMTaskStatus.FAILED,
          response: {
            create: {
              text: i18n?.t(ERROR.unknownError) || 'An unknown error occurred.',
            },
          },
        },
        include: {
          response: true,
        },
      });
      return {
        ...res,
        response: res.response
          ? {
              id: res.response.id,
              text: res.response.text,
              products: null,
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
      jobId: this.getProductEmbeddingTaskJobId(data.productId, data.lang),
    });

    return newEmbeddingTask;
  }

  async addProductContentEmbeddingTask(data: EmbeddingJob) {
    const newContentTask = await this.prisma.embeddingTask.create({
      data: {
        productId: data.productId,
        lang: data.lang,
        status: LLMTaskStatus.PENDING,
        type: 'PRODUCT_CONTENT',
      },
    });

    await this.llmTasksQueue.add(
      LLMTaskJobType.PRODUCT_CONTENT_EMBEDDING,
      data,
      {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
        priority: 5,
        jobId: this.getProductContentEmbeddingTaskJobId(
          data.productId,
          data.lang,
        ),
      },
    );

    return newContentTask;
  }

  private getProductContentEmbeddingTaskJobId(
    productId: number,
    lang: string,
  ): string {
    return `product-content-embedding-${productId}-${lang}`;
  }

  private getProductEmbeddingTaskJobId(
    productId: number,
    lang: string,
  ): string {
    return `product-embedding-${productId}-${lang}`;
  }

  private getUserPromptTaskJobIdByUserId(userId: number): string {
    return `user-prompt-${userId}`;
  }

  async removeProductEmbeddingTask(
    productId: number,
    lang: string,
  ): Promise<void> {
    const task = await this.prisma.embeddingTask.findUnique({
      where: {
        productId_lang_type: {
          productId: productId,
          lang: lang,
          type: 'PRODUCT',
        },
      },
    });

    if (!task) {
      return;
    }

    await this.llmTasksQueue.remove(
      this.getProductEmbeddingTaskJobId(productId, lang),
    );
    await this.prisma.embeddingTask.delete({
      where: { id: task.id },
    });
  }

  async removeProductContentEmbeddingTask(
    productId: number,
    lang: string,
  ): Promise<void> {
    const task = await this.prisma.embeddingTask.findUnique({
      where: {
        productId_lang_type: {
          productId: productId,
          lang: lang,
          type: 'PRODUCT_CONTENT',
        },
      },
    });

    if (!task) {
      return;
    }
    await this.llmTasksQueue.remove(
      this.getProductContentEmbeddingTaskJobId(productId, lang),
    );
    await this.prisma.embeddingTask.delete({
      where: { id: task.id },
    });
  }

  async removeUserPromptTaskByUserId(id: number): Promise<void> {
    await this.llmTasksQueue.remove(this.getUserPromptTaskJobIdByUserId(id));
  }
}
