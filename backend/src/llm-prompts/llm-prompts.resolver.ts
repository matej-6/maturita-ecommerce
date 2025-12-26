import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LLMPromptsService } from './llm-prompts.service';
import { Logger, UseGuards } from '@nestjs/common';
import { LLMTask } from './entities/llm-task.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateLLMPromptInput } from './dto/create-llm-prompt.input';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';

@Resolver()
export class LLMPromptsResolver {
  private readonly logger = new Logger(LLMPromptsResolver.name);

  constructor(private readonly llmTasksService: LLMPromptsService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => LLMTask)
  async createLlmTask(
    @Args('input') input: CreateLLMPromptInput,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<LLMTask> {
    return await this.llmTasksService.createTask(input, user.id);
    // return await this.llmTasksService.createTask(input, 33);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => LLMTask, { nullable: true })
  async getUserLLMTaskById(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<LLMTask | null> {
    return await this.llmTasksService.getTaskById(id, user.id);
  }
}
