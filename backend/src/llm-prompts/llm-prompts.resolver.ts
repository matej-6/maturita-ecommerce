import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LLMPromptsService } from './llm-prompts.service';
import { UseGuards } from '@nestjs/common';
import { LLMTask } from './entities/llm-task.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateLLMPromptInput } from './dto/create-llm-prompt.input';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { I18nContext } from 'nestjs-i18n';
import { LocalesService } from 'src/locales/locales.service';

@Resolver()
export class LLMPromptsResolver {
  constructor(
    private readonly llmTasksService: LLMPromptsService,
    private readonly localesService: LocalesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => LLMTask)
  async createLlmTask(
    @Args('input') input: CreateLLMPromptInput,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<LLMTask> {
    const lang =
      I18nContext.current()?.lang ||
      this.localesService.getDefaultLocale().code;

    return await this.llmTasksService.createTask(input, user.id, lang);
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
