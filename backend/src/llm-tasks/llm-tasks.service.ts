import { Injectable } from '@nestjs/common';
import { LLMTask } from './entities/llm-task.entity';
import { CreateLLMTaskInput } from './dto/create-llm-task.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { LLMTaskStatus } from 'generated/prisma/enums';

@Injectable()
export class LlmTasksService {
  private readonly DAILY_USER_TASK_LIMIT = 20;
  constructor(private readonly prisma: PrismaService) {}

  async createTask(
    input: CreateLLMTaskInput,
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
        date: new Date(),
        status: LLMTaskStatus.PENDING,
        userId: userId,
      },
    });

    return llmTask;
  }
}
