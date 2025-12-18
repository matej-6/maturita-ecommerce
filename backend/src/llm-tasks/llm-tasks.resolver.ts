import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LlmTasksService } from './llm-tasks.service';
import { Logger, UseGuards } from '@nestjs/common';
import { LLMTask } from './entities/llm-task.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateLLMTaskInput } from './dto/create-llm-task.input';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';

@Resolver()
export class LlmTasksResolver {
  private readonly logger = new Logger(LlmTasksResolver.name);

  constructor(private readonly llmTasksService: LlmTasksService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => LLMTask)
  async createLlmTask(
    @Args('input') input: CreateLLMTaskInput,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<LLMTask> {
    return await this.llmTasksService.createTask(input, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => LLMTask, { nullable: true })
  async getUserLLMTaskById(
    @Args('id') id: number,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<LLMTask | null> {
    return await this.llmTasksService.getTaskById(id, user.id);
  }
}
