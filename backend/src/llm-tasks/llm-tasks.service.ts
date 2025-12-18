import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { LLMTask } from './entities/llm-task.entity';
import { CreateLLMTaskInput } from './dto/create-llm-task.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { LLMTaskStatus } from 'generated/prisma/enums';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/validate';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { LocalesService } from 'src/locales/locales.service';

@Injectable()
export class LlmTasksService implements OnModuleInit {
  private readonly logger = new Logger(LlmTasksService.name);

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

  private async promptLLM<T>(system: string, prompt: string): Promise<T> {
    const res = await fetch(`${this.LLM_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.LLM_MODEL,
        system: system,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`LLM request failed with status ${res.status}`);
    }

    try {
      const data = (await res.json()) as { response: string };
      this.logger.log('LLM response data:', data);
      const output = (await JSON.parse(data.response)) as T;
      return output;
    } catch (error) {
      this.logger.error('Error parsing LLM response as JSON', error);
      throw new Error('Failed to parse LLM response as JSON');
    }
  }

  private async categorizePrompt(
    prompt: string,
  ): Promise<
    'similiarProducts' | 'productSearch' | 'productInformation' | 'none'
  > {
    const system = `You are an AI assistant that categorizes user prompts into one of 4 categories: 'similiarProducts', 'productSearch', 'productInformation', or 'none'.
    Here's a brief description of each category:
    1. similiarProducts: The user is looking for products similar to a given product
    2. productSearch: The user is searching for products based on certain criteria or keywords
    3. productInformation: The user is seeking specific information about a particular product
    4. none: The prompt does not fit into any of the above categories.

    Analyze the following prompt and determine the most appropriate category.
    Respond with this JSON FORMAT, NOTHING ELSE: { "category": "your_chosen_category" }`;
    const response = await this.promptLLM<{ category: string }>(system, prompt);
    const category = response.category;
    if (
      category !== 'similiarProducts' &&
      category !== 'productSearch' &&
      category !== 'productInformation' &&
      category !== 'none'
    ) {
      this.logger.error('Invalid category returned from LLM', category);
      throw new Error('Invalid category returned from LLM');
    }
    return category;
  }

  private async translateToEnglish(prompt: string): Promise<{
    translation: string;
    original_language: string;
  }> {
    const system = `You are an AI assistant that translates user prompts into English.
    Translate the following prompt into English. If the prompt is already in English, return it unchanged.
    Also detect the original language of the prompt and include it in your response in the 'original_language' field in ISO 639-1 format.
    Respond with this JSON FORMAT, NOTHING ELSE: { "translation": "translated_prompt_in_english", "original_language": "language_code" }`;
    const response = await this.promptLLM<{
      translation: string;
      original_language: string;
    }>(system, prompt);
    return response;
  }

  async consumeLlmTask(task: {
    id: number;
    prompt: string;
    productId?: number;
  }) {
    const translationResult = await this.translateToEnglish(task.prompt);

    this.logger.log(
      `Original prompt language: ${translationResult.original_language}`,
    );
    this.logger.log(`Translated prompt: ${translationResult.translation}`);

    const category = await this.categorizePrompt(translationResult.translation);

    if (category === 'none') {
      await this.prisma.lLMTask.update({
        where: { id: task.id },
        data: {
          status: LLMTaskStatus.FAILED,
          response: 'I can not help with that prompt.',
        },
      });
      return;
    }

    if (
      (category === 'productInformation' || category === 'similiarProducts') &&
      !task.productId
    ) {
      await this.prisma.lLMTask.update({
        where: { id: task.id },
        data: {
          status: LLMTaskStatus.FAILED,
          response: 'Product ID is required for product information requests.',
        },
      });
      return;
    }

    try {
      const response = await this.generateProductInformationResponse(
        translationResult.translation,
        task.productId!,
      );

      this.logger.log(`Generated LLM task response: ${response}`);

      await this.prisma.lLMTask.update({
        where: { id: task.id },
        data: {
          status: LLMTaskStatus.COMPLETED,
          response: response,
        },
      });
    } catch (error) {
      this.logger.error('Error generating LLM task response', error);
      await this.prisma.lLMTask.update({
        where: { id: task.id },
        data: {
          status: LLMTaskStatus.FAILED,
          response: 'Failed to generate response for the prompt.',
        },
      });
    }
  }

  private async generateProductInformationResponse(
    prompt: string,
    productId: number,
  ): Promise<string> {
    const productContent = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        Category: {
          select: {
            CategoryTranslation: {
              where: {
                locale: this.localesService.getDefaultLocale().code,
              },
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
        ProductTranslations: {
          where: {
            locale: this.localesService.getDefaultLocale().code,
          },
          select: {
            markdownContent: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!productContent) {
      throw new Error('Product not found');
    }

    const system = `You are an AI assistant that provides detailed information about products based on their descriptions and categories.
    Use the following product information to answer the user's prompt:
    ${JSON.stringify(productContent)}

    Answer the user's prompt in detail using the provided product information. If the information is insufficient, respond accordingly.
    Respond with this JSON FORMAT, NOTHING ELSE: { "answer": "your_detailed_answer" }
    `;

    const response = await this.promptLLM<{ answer: string }>(system, prompt);
    return response.answer;
  }

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
        userId: userId,
        status: LLMTaskStatus.PENDING,
      },
    });

    await this.llmTasksQueue.add('llm-task', {
      id: llmTask.id,
      prompt: llmTask.prompt,
      productId: input.productId,
    });
    return llmTask;
  }

  async getTaskById(id: number, userId: number): Promise<LLMTask | null> {
    const llmTask = await this.prisma.lLMTask.findUnique({
      where: { id, userId },
    });
    return llmTask ?? null;
  }
}
