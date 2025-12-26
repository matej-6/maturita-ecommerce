import { Processor, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { EmbeddingTaskStatus } from 'generated/prisma/enums';
import { randomUUID } from 'node:crypto';
import { Env } from 'src/config/validate';
import { LLMPromptsService } from 'src/llm-prompts/llm-prompts.service';
import { LocalesService } from 'src/locales/locales.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { QdrantCollections, QdrantService } from 'src/qdrant/qdrant.service';
import { translate } from '@vitalets/google-translate-api';

export enum LLMTaskJobType {
  USER_PROMPT = 'user-prompt',
  PRODUCT_EMBEDDING = 'product-embedding',
  PRODUCT_CONTENT_EMBEDDING = 'product-content-embedding',
}

export type UserPromptJob = {
  id: number;
  userId: number;
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
    @Inject(forwardRef(() => LLMPromptsService))
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
    console.log('Processing job:', job);
    switch (job.name as LLMTaskJobType) {
      case LLMTaskJobType.USER_PROMPT: {
        this.logger.log(`Processing USER_PROMPT job id ${job.id}`);
        const jobData = job.data as UserPromptJob;
        try {
          const response = await this.processUserPromptJob(jobData);
          await this.llmPromptsService.markTaskAsCompleted(
            jobData.id,
            response,
          );
          return {};
        } catch (error) {
          this.logger.error('Error processing USER_PROMPT job', error);
          await this.llmPromptsService.markTaskAsFailed(
            jobData.id,
            (error as Error).message,
          );
          throw error;
        }
      }
      case LLMTaskJobType.PRODUCT_EMBEDDING: {
        this.logger.log(`Processing PRODUCT_EMBEDDING job id ${job.id}`);
        const jobData = job.data as EmbeddingJob;
        try {
          const dbEmbeddingTask = await this.prisma.embeddingTask.findUnique({
            where: { productId: jobData.productId },
          });
          if (!dbEmbeddingTask) {
            await this.prisma.embeddingTask.create({
              data: {
                productId: jobData.productId,
                status: EmbeddingTaskStatus.PENDING,
              },
            });
          }
          await this.processProductEmbeddingJob(jobData);
          await this.prisma.embeddingTask.update({
            where: { productId: jobData.productId },
            data: {
              status: EmbeddingTaskStatus.COMPLETED,
            },
          });
          return {};
        } catch (error) {
          this.logger.error('Error processing PRODUCT_EMBEDDING job', error);
          await this.prisma.embeddingTask.update({
            where: { productId: jobData.productId },
            data: {
              status: EmbeddingTaskStatus.FAILED,
            },
          });
          throw error;
        }
      }
      case LLMTaskJobType.PRODUCT_CONTENT_EMBEDDING: {
        const jobData = job.data as EmbeddingJob;
        try {
          const dbEmbeddingTask =
            await this.prisma.productContentEmbeddingTask.findUnique({
              where: { productId: jobData.productId },
            });
          if (!dbEmbeddingTask) {
            await this.prisma.productContentEmbeddingTask.create({
              data: {
                productId: jobData.productId,
                status: EmbeddingTaskStatus.PENDING,
              },
            });
          }
          await this.processProductContentEmbeddingJob(jobData);
          return {};
        } catch (error) {
          this.logger.error(
            'Error processing PRODUCT_CONTENT_EMBEDDING job',
            error,
          );
          await this.prisma.productContentEmbeddingTask.update({
            where: { productId: jobData.productId },
            data: {
              status: EmbeddingTaskStatus.FAILED,
            },
          });
          throw error;
        }
      }
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  private async fetchLLM<T = string>(
    system: string,
    prompt: string,
    parseJson: boolean = true,
  ): Promise<T> {
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
      if (!parseJson) {
        return data.response as T;
      }
      const output = (await JSON.parse(data.response)) as T;
      return output;
    } catch (error) {
      this.logger.error('Error parsing LLM response as JSON', error);
      throw new Error('An unexpected error ocurred. Please try again.');
    }
  }

  private async fetchEmbedding(input: string): Promise<number[][]> {
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

    const data = (await res.json()) as { embeddings: number[][] };
    this.logger.log('Embedding response data:', data);
    return data.embeddings;
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
      throw new Error('Something went wrong.');
    }
    return category;
  }

  private async translate(
    textToTranslate: string,
    from: string = 'auto',
    to: string = 'en',
  ): Promise<{
    translation: string;
    original_language: string;
  }> {
    const { raw, text } = await translate(textToTranslate, {
      from: from,
      to: to,
    });

    return {
      original_language: raw.src,
      translation: text,
    };
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

    this.logger.log(`Generated embedding for product ID ${product.id}`);
    this.logger.log(`Embedding vector length: ${res.length}`);

    await this.qdrantService.qdrantClient.upsert(QdrantCollections.PRODUCTS, {
      points: [
        {
          id: product.id,
          vector: res[0],
          payload: {
            productId: product.id,
            ...input,
          },
        },
      ],
      wait: true,
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
      this.logger.log(
        `Generated embedding for product ID ${product.id}, chunk ${i}`,
      );
      this.logger.log(
        `Embedding vector length: ${embeddingResponse[0].length}`,
      );
      await this.qdrantService.qdrantClient.upsert(
        QdrantCollections.PRODUCT_CHUNKS,
        {
          points: [
            {
              id: randomUUID(),
              vector: embeddingResponse[0],
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

  private async translateResponseToOriginalLanguage(
    englishResponse: string,
    originalLanguageCode: string,
  ) {
    const system = `Translate the following text from English to this language code: ${originalLanguageCode}. Respond ONLY with the translated text.`;
    const response = await this.fetchLLM<string>(
      system,
      englishResponse,
      false,
    );
    return response;
  }

  private chunkProductContentForEmbedding(
    content: string,
    chunkSize: number = 500,
  ): string[] {
    const chunks: string[] = [];

    const words = content.split(' ');
    let currentChunk = [];
    let currentLength = 0;

    for (const word of words) {
      currentChunk.push(word);
      currentLength += word.length + 1;
      if (currentLength >= chunkSize) {
        chunks.push(currentChunk.join(' '));
        currentChunk = [];
        currentLength = 0;
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
    }

    return chunks;
  }

  async processUserPromptJob(job: UserPromptJob): Promise<string> {
    let userPrompt = job.prompt;
    let originalLanguage = 'en';

    try {
      const translationResult = await this.translate(job.prompt);
      userPrompt = translationResult.translation;
      originalLanguage = translationResult.original_language;
    } catch (error) {
      this.logger.error('Translate API failed: ' + error.message);
    }

    const category = await this.categorizePrompt(userPrompt);

    if (category === 'none') {
      throw new Error("I can't assist with that request.");
    }

    if (
      (category === 'productInformation' || category === 'similiarProducts') &&
      !job.productId
    ) {
      throw new Error("I can't provide that information without a product.");
    }

    if (category === 'similiarProducts') {
      return await this.processSimiliarProductsPrompt(
        userPrompt,
        job.productId!,
      );
    }

    if (category === 'productSearch') {
      return await this.processProductSearchPrompt(userPrompt);
    }

    let response = await this.generateProductInformationResponse(
      userPrompt,
      job.productId!,
    );

    this.logger.log(`Generated LLM task response: ${response}`);

    if (originalLanguage !== 'en') {
      try {
        const responseTranslationResult = await this.translate(
          response,
          originalLanguage,
          'en',
        );
        response = responseTranslationResult.translation;
      } catch (error) {
        this.logger.error('Translation API failed: ' + error.message);
      }
    }

    return response;
  }

  private async processSimiliarProductsPrompt(
    prompt: string,
    productId: number,
  ): Promise<string> {
    const embedding = (await this.fetchEmbedding(prompt))[0];

    const similarProducts = await this.qdrantService.qdrantClient.search(
      QdrantCollections.PRODUCTS,
      {
        vector: embedding,
        limit: 5,
        filter: {
          must: [
            {
              key: 'productId',
              match: { value: productId },
            },
          ],
        },
      },
    );

    const system = `You are an AI assistant that provides a list of products similar to a given product based on its attributes and description.
    Use the following similar products to answer the user's prompt:
    ${JSON.stringify(similarProducts)}

    Answer the user's prompt using the provided similar products. If the information is insufficient, respond accordingly.
    `;

    return await this.fetchLLM<string>(system, prompt, false);
  }

  private async processProductSearchPrompt(prompt: string): Promise<string> {
    const embedding = (await this.fetchEmbedding(prompt))[0];

    const similarProducts = await this.qdrantService.qdrantClient.search(
      QdrantCollections.PRODUCTS,
      {
        vector: embedding,
        limit: 5,
      },
    );

    const system = `You are an AI assistant that provides a list of products based on a user's search criteria.
    Use the following products to answer the user's prompt:
    ${JSON.stringify(similarProducts)}

    Answer the user's prompt using the provided products. If the information is insufficient, respond accordingly.
    `;

    return await this.fetchLLM<string>(system, prompt, false);
  }

  private async generateProductInformationResponse(
    prompt: string,
    productId: number,
  ): Promise<string> {
    const embedding = (await this.fetchEmbedding(prompt))[0];

    const productContent = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
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
            stock: true,
          },
        },
      },
    });

    if (!productContent) {
      throw new Error('Product not found');
    }

    const similarChunks = await this.qdrantService.qdrantClient.search(
      QdrantCollections.PRODUCT_CHUNKS,
      {
        vector: embedding,
        limit: 2,
        filter: {
          must: [
            {
              key: 'productId',
              match: { value: productId },
            },
          ],
        },
      },
    );

    similarChunks.forEach((c) => this.logger.log(c.payload));

    const productInfo = {
      name: productContent.ProductTranslations[0]?.name || '',
      description: productContent.ProductTranslations[0]?.description || '',
      variants: productContent.ProductVariants.map((variant) => ({
        sku: variant.sku,
        priceInCents: variant.priceInCents,
        stock: variant.stock,
      })),
      contentChunks: similarChunks.map(
        (chunk) => JSON.stringify(chunk.payload) || '',
      ),
    };

    const system = `You are an AI assistant that provides detailed information about products based on their name, description, variants and content chunks.
    Use the following product information to answer the user's prompt:
    ${JSON.stringify(productInfo)}

    Answer the user's prompt using the provided product information. If the information is insufficient, respond accordingly.
    `;

    return await this.fetchLLM<string>(system, prompt, false);
  }
}
