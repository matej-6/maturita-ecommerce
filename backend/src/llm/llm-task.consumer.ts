import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { LLMTaskStatus } from 'generated/prisma/enums';
import { Env } from 'src/config/validate';
import { LLMPromptsService } from 'src/llm-prompts/llm-prompts.service';
import { LocalesService } from 'src/locales/locales.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { QdrantService } from 'src/qdrant/qdrant.service';

export enum LLMTaskJobType {
  USER_PROMPT = 'user-prompt',
  EMBEDDING = 'embedding',
}

export type UserPromptJob = {
  id: number;
  prompt: string;
  productId?: number;
};

export type EmbeddingJob = {
  id: number;
  productId: number;
};

type LLMTaskJob = UserPromptJob | EmbeddingJob;

@Processor('llm-tasks')
export class LLMTaskConsumer extends WorkerHost {
  private readonly logger = new Logger(LLMTaskConsumer.name);

  private readonly LLM_BASE_URL: string;
  private readonly LLM_MODEL: string;
  private readonly EMBEDDING_MODEL: string;
  constructor(
    private readonly llmTasksService: LLMPromptsService,
    private readonly prisma: PrismaService,
    private readonly qdrantService: QdrantService,
    private readonly configService: ConfigService<Env>,
    private readonly localesService: LocalesService,
  ) {
    super();
    this.LLM_BASE_URL = this.configService.getOrThrow('OLLAMA_BASE_URL');
    this.LLM_MODEL = this.configService.getOrThrow('OLLAMA_LLM_MODEL');
    this.EMBEDDING_MODEL = this.configService.getOrThrow(
      'OLLAMA_EMBEDDING_MODEL',
    );
  }

  async process(job: Job<LLMTaskJob, any, string>): Promise<any> {
    switch (job.name as keyof typeof LLMTaskJobType) {
      case 'USER_PROMPT':
        await this.processUserPromptJob(job.data as UserPromptJob);
        break;
      case 'EMBEDDING':
        await this.llmTasksService.consumeEmbeddingTask(
          job.data as EmbeddingJob,
        );
        break;
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  private async fetchLLM<T>(system: string, prompt: string): Promise<T> {
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

  private async fetchEmbedding(text: string): Promise<number[]> {
    const res = await fetch(`${this.LLM_BASE_URL}/api/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.EMBEDDING_MODEL,
        text: text,
      }),
    });

    if (!res.ok) {
      throw new Error(`Embedding request failed with status ${res.status}`);
    }

    const data = (await res.json()) as { embedding: number[] };
    return data.embedding;
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
    const response = await this.fetchLLM<{ category: string }>(system, prompt);
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
    If you are unsure of the original language, respond with original language as 'unknown' and with the translation unchanged.
    Respond with this JSON FORMAT, NOTHING ELSE: { "translation": "translated_prompt_in_english", "original_language": "en" }`;
    const response = await this.fetchLLM<{
      translation: string;
      original_language: string;
    }>(system, prompt);
    return response;
  }

  async processProductEmbeddingJob(job: EmbeddingJob): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: job.productId,
      },
      include: {
        ProductTranslations: {
          where: {
            locale: this.localesService.getDefaultLocale().code,
          },
        },
        Category: {
          include: {
            CategoryTranslation: {
              where: {
                locale: this.localesService.getDefaultLocale().code,
              },
            },
          },
        },
        ProductVariants: {
          include: {
            Attributes: true,
          },
        },
      },
    });

    if (!product) {
      this.logger.error(
        `Product with ID ${job.productId} not found for embedding job`,
      );
      return;
    }

    // embed the product content for questions about this product
    const chunkedContent = this.chunkProductContentForEmbedding(
      product.ProductTranslations[0]?.markdownContent || '',
    );

    for (let i = 0; i < chunkedContent.length; i++) {
      const embeddingResponse = await this.fetchEmbedding(chunkedContent[i]);
      await this.qdrantService.qdrantClient.upsert('product_chunks', {
        points: [
          {
            id: `${product.id}_content_${i}`,
            vector: embeddingResponse,
            payload: {
              productId: product.id,
              text: chunkedContent[i],
            },
          },
        ],
      });
    }
  }

  private chunkProductContentForEmbedding(content: string): string[] {
    const chunks: string[] = [];
    const paragraphs = content.split('\n');
    for (const paragraph of paragraphs) {
      if (paragraph.trim().length > 0) {
        chunks.push(paragraph.trim());
      }
    }

    return chunks;
  }

  async processUserPromptJob(job: UserPromptJob): Promise<void> {
    const translationResult = await this.translateToEnglish(job.prompt);

    this.logger.log(
      `Original prompt language: ${translationResult.original_language}`,
    );
    this.logger.log(`Translated prompt: ${translationResult.translation}`);

    const category = await this.categorizePrompt(translationResult.translation);

    if (category === 'none') {
      await this.prisma.lLMTask.update({
        where: { id: job.id },
        data: {
          status: LLMTaskStatus.FAILED,
          response: 'I can not help with that prompt.',
        },
      });
      return;
    }

    if (
      (category === 'productInformation' || category === 'similiarProducts') &&
      !job.productId
    ) {
      await this.prisma.lLMTask.update({
        where: { id: job.id },
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
        job.productId!,
      );

      this.logger.log(`Generated LLM task response: ${response}`);

      await this.prisma.lLMTask.update({
        where: { id: job.id },
        data: {
          status: LLMTaskStatus.COMPLETED,
          response: response,
        },
      });
    } catch (error) {
      this.logger.error('Error generating LLM task response', error);
      await this.prisma.lLMTask.update({
        where: { id: job.id },
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

    const response = await this.fetchLLM<{ answer: string }>(system, prompt);
    return response.answer;
  }
}
