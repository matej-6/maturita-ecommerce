import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { LLMTask } from './entities/llm-task.entity';
import { CreateLLMPromptInput } from './dto/create-llm-prompt.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { LLMTaskStatus } from 'generated/prisma/enums';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/validate';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { LocalesService } from 'src/locales/locales.service';
import { LLMTaskJobType, UserPromptJob } from 'src/llm/llm-task.consumer';

@Injectable()
export class LLMPromptsService implements OnModuleInit {
  private readonly logger = new Logger(LLMPromptsService.name);

  private readonly DAILY_USER_TASK_LIMIT = 20;
  private readonly LLM_BASE_URL: string;
  private readonly LLM_MODEL: string;
  private readonly EMBEDDING_MODEL: string;
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<Env>,
    private readonly localesService: LocalesService,
    @InjectQueue('llm-tasks') private readonly llmTasksQueue: Queue,
  ) {
    this.LLM_BASE_URL = this.configService.getOrThrow('OLLAMA_BASE_URL');
    this.LLM_MODEL = this.configService.getOrThrow('OLLAMA_LLM_MODEL');
    this.EMBEDDING_MODEL = this.configService.getOrThrow(
      'OLLAMA_EMBEDDING_MODEL',
    );
  }

  async onModuleInit() {
    await this.llmTasksQueue.drain(true);
  }

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

    await this.llmTasksQueue.add(LLMTaskJobType.USER_PROMPT, {
      id: llmTask.id,
      prompt: llmTask.prompt,
      productId: input.productId,
    } as UserPromptJob);
    return llmTask;
  }

  async getTaskById(id: number, userId: number): Promise<LLMTask | null> {
    const llmTask = await this.prisma.lLMTask.findUnique({
      where: { id, userId },
    });
    return llmTask ?? null;
  }
}
