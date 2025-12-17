import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskService } from 'src/tasks/task.service';
import { TasksModule } from 'src/tasks/tasks.module';
import { WorkerService } from './worker.service';

@Module({
  imports: [TasksModule, PrismaModule],
  providers: [WorkerService, TaskService, PrismaService],
  exports: [WorkerService],
})
export class WorkerModule {}
