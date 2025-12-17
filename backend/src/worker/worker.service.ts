import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskService } from 'src/tasks/task.service';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    private readonly taskService: TaskService,
    private readonly prismaService: PrismaService,
  ) {}

  async run() {
    this.logger.log('Worker started');

    while (true) {
      try {
        const task = await this.taskService.getNextTask();
        if (task) {
          this.logger.log(`Processing task ID: ${task.id}`);
          const productVariant =
            await this.prismaService.productVariant.findUnique({
              where: { id: task.productVariantId },
              include: {
                Attributes: true,
                Product: {
                  include: {
                    ProductTranslations: true,
                  },
                },
              },
            });

          if (!productVariant) {
            throw new Error(
              `Product variant with ID ${task.productVariantId} not found`,
            );
          }
          await this.taskService.markTaskInProgress(task.id);
        } else {
          this.logger.log('No pending tasks found, sleeping...');
          await this.sleep();
        }
      } catch (error) {
        this.logger.error(`Worker error: ${error.message}`);
        await this.sleep();
      }
    }
  }

  private sleep() {
    return new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
