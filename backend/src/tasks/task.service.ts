import { Injectable, Logger } from '@nestjs/common';
import { EmbeddingTask } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getNextTask(): Promise<EmbeddingTask | null> {
    const task = await this.prisma.embeddingTask.findFirst({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
    });

    return task;
  }

  async markTaskInProgress(taskId: number): Promise<void> {
    await this.prisma.embeddingTask.update({
      where: { id: taskId },
      data: { status: 'IN_PROGRESS' },
    });
  }

  async markTaskFailed(taskId: number): Promise<void> {
    await this.prisma.embeddingTask.update({
      where: { id: taskId },
      data: { status: 'FAILED' },
    });
  }

  async completeTask(taskId: number): Promise<void> {
    await this.prisma.embeddingTask.delete({
      where: { id: taskId },
    });
  }

  async addNewTask(productVariantId: number): Promise<EmbeddingTask> {
    await this.prisma.embeddingTask.delete({
      where: {
        productVariantId: productVariantId,
      },
    });

    const task = await this.prisma.embeddingTask.create({
      data: {
        productVariantId: productVariantId,
        status: 'PENDING',
      },
    });

    return task;
  }
}
