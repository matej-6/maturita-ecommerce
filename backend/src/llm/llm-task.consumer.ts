import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { EmbeddingTaskStatus } from 'generated/prisma/enums';
import { Env } from 'src/config/validate';
import { LLMPromptsService } from 'src/llm-prompts/llm-prompts.service';
import { LocalesService } from 'src/locales/locales.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { QdrantCollections, QdrantService } from 'src/qdrant/qdrant.service';

export enum LLMTaskJobType {
  USER_PROMPT = 'user-prompt',
  PRODUCT_EMBEDDING = 'product-embedding',
}

export type UserPromptJob = {
  id: number;
  prompt: string;
  productId?: number;
};

export type EmbeddingJob = {
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
    private readonly llmPromptsService: LLMPromptsService,
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
      case 'USER_PROMPT': {
        const jobData = job.data as UserPromptJob;
        try {
          const response = await this.processUserPromptJob(jobData);
          await this.llmPromptsService.markTaskAsCompleted(
            jobData.id,
            response,
          );
        } catch (error) {
          this.logger.error('Error processing USER_PROMPT job', error);
          await this.llmPromptsService.markTaskAsFailed(
            jobData.id,
            (error as Error).message,
          );
        }
        break;
      }
      case 'PRODUCT_EMBEDDING': {
        const jobData = job.data as EmbeddingJob;
        await this.processProductEmbeddingJob(jobData);
        await this.processProductContentEmbeddingJob(jobData);
        break;
      }
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
      this.logger.error(`LLM request failed with status ${res.status}`);
      throw new Error('An unexpected error ocurred. Please try again.');
    }

    try {
      const data = (await res.json()) as { response: string };
      this.logger.log('LLM response data:', data);
      const output = (await JSON.parse(data.response)) as T;
      return output;
    } catch (error) {
      this.logger.error('Error parsing LLM response as JSON', error);
      throw new Error('An unexpected error ocurred. Please try again.');
    }
  }

  private async fetchEmbedding(input: string): Promise<number[]> {
    const res = await fetch(`${this.LLM_BASE_URL}/api/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.EMBEDDING_MODEL,
        input: input,
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
    const system = `Classify the user prompt into ONE category:
- similiarProducts: asks for products similar to a specific product
- productSearch: searches for products by features, filters, or keywords
- productInformation: asks for details about a specific product
- none: does not fit the above

Return ONLY this JSON:
{ "category": "similiarProducts | productSearch | productInformation | none" }`;
    const response = await this.fetchLLM<{ category: string }>(system, prompt);
    const category = response.category;
    if (
      category !== 'similiarProducts' &&
      category !== 'productSearch' &&
      category !== 'productInformation' &&
      category !== 'none'
    ) {
      this.logger.error('Invalid category returned from LLM', category);
      throw new Error('Something went wrong.');
    }
    return category;
  }

  private async translateToEnglish(prompt: string): Promise<{
    translation: string;
    original_language: string;
  }> {
    const system = `Translate the user prompt to English.
If it is already English, return it unchanged.
Detect the original language and include its ISO 639-1 code.
If unsure, set original_language to "unknown" and do not change the text.
Respond ONLY in this JSON format:
{ "translation": "...", "original_language": "..." }`;
    const response = await this.fetchLLM<{
      translation: string;
      original_language: string;
    }>(system, prompt);
    if (
      !response.translation ||
      !response.original_language ||
      response.original_language === 'unknown'
    ) {
      throw new Error('I cannot determine the language of the prompt.');
    }
    return response;
  }

  async processProductEmbeddingJob(job: EmbeddingJob): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: job.productId,
      },
      select: {
        id: true,
        Category: {
          select: {
            slug: true,
            CategoryTranslation: {
              where: {
                locale: this.localesService.getDefaultLocale().code,
              },
              select: {
                name: true,
              },
            },
          },
        },
        slug: true,
        ProductTranslations: {
          where: {
            locale: this.localesService.getDefaultLocale().code,
          },
          select: {
            name: true,
            description: true,
          },
        },
        ProductVariants: {
          select: {
            sku: true,
            priceInCents: true,
            Attributes: {
              select: {
                AttributeKey: {
                  select: {
                    key: true,
                  },
                },
                value: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const input = {
      product: {
        slug: product.slug,
        name: product.ProductTranslations[0]?.name || '',
        description: product.ProductTranslations[0]?.description || '',
        category: {
          slug: product.Category?.slug || '',
          name: product.Category?.CategoryTranslation[0]?.name || '',
        },
        variants: product.ProductVariants.map((variant) => ({
          sku: variant.sku,
          priceInCents: variant.priceInCents,
          attributes: variant.Attributes.map((attr) => ({
            key: attr.AttributeKey.key,
            value: attr.value,
          })),
        })),
      },
    };

    const res = await this.fetchEmbedding(JSON.stringify(input));

    await this.qdrantService.qdrantClient.upsert(QdrantCollections.PRODUCTS, {
      points: [
        {
          id: product.id,
          vector: res,
        },
      ],
    });

    await this.prisma.embeddingTask.update({
      where: { productId: job.productId },
      data: {
        status: EmbeddingTaskStatus.COMPLETED,
      },
    });
  }

  async processProductContentEmbeddingJob(job: EmbeddingJob): Promise<void> {
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
      throw new Error('Product not found');
    }

    const chunkedContent = this.chunkProductContentForEmbedding(
      product.ProductTranslations[0]?.markdownContent || '',
    );

    for (let i = 0; i < chunkedContent.length; i++) {
      const embeddingResponse = await this.fetchEmbedding(chunkedContent[i]);
      await this.qdrantService.qdrantClient.upsert(
        QdrantCollections.PRODUCT_CHUNKS,
        {
          points: [
            {
              id: `${product.id}_chunk_${i}`,
              vector: embeddingResponse,
              payload: {
                productId: product.id,
                text: chunkedContent[i],
              },
            },
          ],
        },
      );
    }

    await this.prisma.productContentEmbeddingTask.update({
      where: {
        productId: job.productId,
      },
      data: {
        status: EmbeddingTaskStatus.COMPLETED,
      },
    });
  }

  async deleteProductEmbeddings(productId: number): Promise<void> {
    await this.qdrantService.qdrantClient.delete(QdrantCollections.PRODUCTS, {
      points: [productId],
    });

    await this.prisma.embeddingTask.delete({
      where: {
        productId: productId,
      },
    });

    await this.qdrantService.qdrantClient.delete(
      QdrantCollections.PRODUCT_CHUNKS,
      {
        filter: {
          must: [
            {
              key: 'productId',
              match: {
                value: productId,
              },
            },
          ],
        },
      },
    );

    await this.prisma.productContentEmbeddingTask.delete({
      where: {
        productId: productId,
      },
    });
  }

  private async translateResponseToOriginalLanguage(
    englishResponse: string,
    originalLanguageCode: string,
  ) {
    const system = `Translate the following text from English to this language code: ${originalLanguageCode}. Respond ONLY with the translated text.`;
    const response = await this.fetchLLM<string>(system, englishResponse);
    return response;
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

  async processUserPromptJob(job: UserPromptJob): Promise<string> {
    const translationResult = await this.translateToEnglish(job.prompt);

    this.logger.log(
      `Original prompt language: ${translationResult.original_language}`,
    );
    this.logger.log(`Translated prompt: ${translationResult.translation}`);

    const category = await this.categorizePrompt(translationResult.translation);

    if (category === 'none') {
      throw new Error("I can't assist with that request.");
    }

    if (
      (category === 'productInformation' || category === 'similiarProducts') &&
      !job.productId
    ) {
      throw new Error("I can't provide that information without a product.");
    }

    let response = await this.generateProductInformationResponse(
      translationResult.translation,
      job.productId!,
    );

    this.logger.log(`Generated LLM task response: ${response}`);

    if (translationResult.original_language !== 'en') {
      response = await this.translateResponseToOriginalLanguage(
        response,
        translationResult.original_language,
      );
      this.logger.log(
        `Translated response to original language (${translationResult.original_language}): ${response}`,
      );
    }

    return response;
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
