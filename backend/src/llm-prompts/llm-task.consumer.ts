import { Processor, WorkerHost } from '@nestjs/bullmq';
import {
  forwardRef,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { EmbeddingTaskStatus } from 'generated/prisma/enums';
import { randomUUID } from 'node:crypto';
import { Env } from 'src/config/validate';
import { LLMPromptsService } from 'src/llm-prompts/llm-prompts.service';
import { LocalesService } from 'src/locales/locales.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { QdrantCollections, QdrantService } from 'src/qdrant/qdrant.service';
import { ERROR } from 'src/errors';
import { I18nService } from 'nestjs-i18n';
import z from 'zod';
import { Ollama } from 'ollama';

export enum LLMTaskJobType {
  USER_PROMPT = 'user-prompt',
  PRODUCT_EMBEDDING = 'product-embedding',
  PRODUCT_CONTENT_EMBEDDING = 'product-content-embedding',
}

export type UserPromptJob = {
  id: number;
  userId: number;
  prompt: string;
  lang: string;
  productId?: number;
};

export type EmbeddingJob = {
  productId: number;
  lang: string;
};

type LLMTaskJob = UserPromptJob | EmbeddingJob;

type UserPromptResponse = {
  text: string;
  productIds: number[];
};

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
    private readonly i18nService: I18nService,
  ) {
    super();
    this.LLM_BASE_URL = this.configService.getOrThrow('OLLAMA_BASE_URL');
    this.LLM_MODEL = this.configService.getOrThrow('OLLAMA_LLM_MODEL');
    this.EMBEDDING_MODEL = this.configService.getOrThrow(
      'OLLAMA_EMBEDDING_MODEL',
    );
  }

  private get ollamaClient(): Ollama {
    return new Ollama({
      host: this.LLM_BASE_URL,
    });
  }

  async process(job: Job<LLMTaskJob, any, string>): Promise<any> {
    this.logger.log(`Received job id ${job.id}, type ${job.name}`);
    switch (job.name as LLMTaskJobType) {
      case LLMTaskJobType.USER_PROMPT: {
        this.logger.log(`Processing USER_PROMPT job id ${job.id}`);
        const jobData = job.data as UserPromptJob;
        const supportedLanguages = this.localesService
          .findAll()
          .map((l) => l.code as string);
        if (!supportedLanguages.includes(jobData.lang)) {
          jobData.lang = this.localesService.getDefaultLocale().code;
        }
        try {
          const response = await this.processUserPromptJob(jobData);
          await this.llmPromptsService.markTaskAsCompleted(
            jobData.id,
            response.text,
            response.productIds,
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
            where: {
              productId_lang: {
                productId: jobData.productId,
                lang: jobData.lang,
              },
            },
          });
          if (!dbEmbeddingTask) {
            await this.prisma.embeddingTask.create({
              data: {
                productId: jobData.productId,
                status: EmbeddingTaskStatus.PENDING,
                lang: jobData.lang,
              },
            });
          }
          await this.processProductEmbeddingJob(jobData);
          await this.prisma.embeddingTask.update({
            where: {
              productId_lang: {
                productId: jobData.productId,
                lang: jobData.lang,
              },
            },
            data: {
              status: EmbeddingTaskStatus.COMPLETED,
            },
          });
          return {};
        } catch (error) {
          this.logger.error('Error processing PRODUCT_EMBEDDING job', error);
          await this.prisma.embeddingTask.update({
            where: {
              productId_lang: {
                productId: jobData.productId,
                lang: jobData.lang,
              },
            },
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
              where: {
                productId_lang: {
                  productId: jobData.productId,
                  lang: jobData.lang,
                },
              },
            });
          if (!dbEmbeddingTask) {
            await this.prisma.productContentEmbeddingTask.create({
              data: {
                productId: jobData.productId,
                status: EmbeddingTaskStatus.PENDING,
                lang: jobData.lang,
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
            where: {
              productId_lang: {
                productId: jobData.productId,
                lang: jobData.lang,
              },
            },
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

  private async fetchLLM<T extends z.ZodObject>(
    system: string,
    prompt: string,
    schema: T,
  ): Promise<z.output<T>> {
    const result = await this.ollamaClient.generate({
      model: this.LLM_MODEL,
      system: system,
      prompt: prompt,
      stream: false,
      format: z.toJSONSchema(schema),
    });
    try {
      this.logger.log(`LLM response: ${result.response}`);
      return schema.parse(JSON.parse(result.response));
    } catch (error) {
      this.logger.error('Error parsing LLM response with Zod schema', error);
      throw new Error(ERROR.unknownError);
    }
  }

  private async fetchEmbedding(...input: string[]): Promise<number[][]> {
    const result = await this.ollamaClient.embed({
      model: this.EMBEDDING_MODEL,
      input: input,
    });
    for (const embedding of result.embeddings) {
      this.logger.log(`Embedding vector length: ${embedding.length}`);
    }
    return result.embeddings;
  }

  private async categorizePrompt(
    prompt: string,
  ): Promise<
    'similiarProducts' | 'productSearch' | 'productInformation' | 'none'
  > {
    const categorySchema = z.object({
      category: z.literal([
        'similiarProducts',
        'productSearch',
        'productInformation',
        'none',
      ]),
    });
    const system = `You are an AI assistant that categorizes user prompts into one of 4 categories: 'similiarProducts', 'productSearch', 'productInformation', or 'none'.
        Here's a brief description of each category:
        1. similiarProducts: The user is looking for products similar to a given product
        2. productSearch: The user is searching for products based on certain criteria or keywords, for example "What are the best products for building muscle?"
        3. productInformation: The user is seeking specific information about a particular product
        4. none: The prompt does not fit into any of the above categories.
        Analyze the following prompt and determine the most appropriate category.`;
    const response = await this.fetchLLM(system, prompt, categorySchema);
    return response.category;
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
                locale: job.lang,
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
            locale: job.lang,
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
                AttributeTranslations: {
                  where: {
                    locale: job.lang,
                  },
                },
                AttributeKey: {
                  select: {
                    Translations: {
                      where: {
                        locale: job.lang,
                      },
                    },
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
      throw new Error('llm.consumer.productNotFound');
    }

    if (product.ProductTranslations.length === 0) {
      throw new Error('llm.consumer.translationNotFound');
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
          price: (variant.priceInCents / 100).toFixed(2) + ' €',
          attributes: variant.Attributes.map((attr) => ({
            key:
              attr.AttributeKey.Translations[0]?.keyTranslation ||
              attr.AttributeKey.key,
            value: attr.AttributeTranslations[0]?.value || attr.value,
          })),
        })),
      },
    };

    const res = (await this.fetchEmbedding(JSON.stringify(input)))[0];

    this.logger.log(`Generated embedding for product ID ${product.id}`);
    this.logger.log(`Embedding vector length: ${res.length}`);

    try {
      await this.qdrantService.qdrantClient.upsert(QdrantCollections.PRODUCTS, {
        points: [
          {
            id: randomUUID(),
            vector: res,
            payload: {
              ...input,
              productId: product.id,
              lang: job.lang,
            },
          },
        ],
        wait: true,
      });
    } catch (e) {
      this.logger.error('Error upserting embedding to Qdrant', e);
      throw new InternalServerErrorException(ERROR.unknownError);
    }
  }

  async processProductContentEmbeddingJob(job: EmbeddingJob): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: job.productId,
      },
      include: {
        ProductTranslations: {
          where: {
            locale: job.lang,
          },
        },
        Category: {
          include: {
            CategoryTranslation: {
              where: {
                locale: job.lang,
              },
            },
          },
        },
        ProductVariants: {
          include: {
            Attributes: {
              include: {
                AttributeTranslations: {
                  where: {
                    locale: job.lang,
                  },
                },
                AttributeKey: {
                  include: {
                    Translations: {
                      where: {
                        locale: job.lang,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new Error('llm.consumer.productNotFound');
    }

    if (product.ProductTranslations.length === 0) {
      throw new Error('llm.consumer.translationNotFound');
    }

    const chunkedContent = this.chunkProductContentForEmbedding(
      product.ProductTranslations[0]?.markdownContent || '',
    );

    const res = await this.fetchEmbedding(...chunkedContent);

    await this.qdrantService.qdrantClient.delete(
      QdrantCollections.PRODUCT_CHUNKS,
      {
        filter: {
          must: [
            {
              key: 'productId',
              match: { value: product.id },
            },
            {
              key: 'lang',
              match: { value: job.lang },
            },
          ],
        },
      },
    );

    for (let i = 0; i < res.length; i++) {
      this.logger.log(
        `Embedding vector length for chunk ${i}: ${res[i].length}`,
      );
      await this.qdrantService.qdrantClient.upsert(
        QdrantCollections.PRODUCT_CHUNKS,
        {
          points: [
            {
              id: randomUUID(),
              vector: res[i],
              payload: {
                productId: product.id,
                lang: job.lang,
                text: chunkedContent[i],
              },
            },
          ],
        },
      );
    }

    await this.prisma.productContentEmbeddingTask.update({
      where: {
        productId_lang: {
          productId: job.productId,
          lang: job.lang,
        },
      },
      data: {
        status: EmbeddingTaskStatus.COMPLETED,
      },
    });
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

  async processUserPromptJob(job: UserPromptJob): Promise<UserPromptResponse> {
    const userPrompt = job.prompt;
    const lang = job.lang;

    const category = await this.categorizePrompt(userPrompt);

    if (category === 'none') {
      throw new Error(
        this.i18nService.t('llm.consumer.unknownPromptCategory', {
          lang: lang,
        }),
      );
    }

    if (
      (category === 'productInformation' || category === 'similiarProducts') &&
      !job.productId
    ) {
      throw new Error(
        this.i18nService.t('llm.consumer.missingProductId', {
          lang: lang,
        }),
      );
    }

    if (category === 'similiarProducts') {
      return await this.processSimiliarProductsPrompt(
        userPrompt,
        job.productId!,
        lang,
      );
    }

    if (category === 'productSearch') {
      return await this.processProductSearchPrompt(userPrompt, lang);
    }

    return await this.generateProductInformationResponse(
      userPrompt,
      job.productId!,
      lang,
    );
  }

  private async processSimiliarProductsPrompt(
    prompt: string,
    productId: number,
    lang: string,
  ): Promise<UserPromptResponse> {
    const productInfo = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        slug: true,
        Category: {
          select: {
            slug: true,
            CategoryTranslation: {
              where: {
                locale: lang,
              },
              select: {
                name: true,
              },
            },
          },
        },
        ProductTranslations: {
          where: {
            locale: lang,
          },
          select: {
            name: true,
            description: true,
          },
        },
      },
    });

    if (!productInfo) {
      throw new Error(this.i18nService.t('llm.consumer.productNotFound'));
    }

    const productSummary = {
      slug: productInfo.slug,
      name: productInfo.ProductTranslations[0]?.name || '',
      description: productInfo.ProductTranslations[0]?.description || '',
      category: {
        slug: productInfo.Category?.slug || '',
        name: productInfo.Category?.CategoryTranslation[0]?.name || '',
      },
    };

    const embedding = (
      await this.fetchEmbedding(JSON.stringify(productSummary))
    )[0];

    const similarProducts = await this.qdrantService.qdrantClient.search(
      QdrantCollections.PRODUCTS,
      {
        vector: embedding,
        limit: 2,
        filter: {
          must_not: [
            {
              key: 'productId',
              match: { value: productId },
            },
          ],
          must: [
            {
              key: 'lang',
              match: { value: lang },
            },
          ],
        },
      },
    );

    if (similarProducts.length === 0) {
      throw new Error(
        this.i18nService.t('llm.consumer.noSimilarProductsFound'),
      );
    }

    const system = `You are an AI assistant that provides a list of products similar to a given product based on its attributes and description.
    Use the information from the following similar products to answer the user's prompt. Please formulate it to answer the user's questions. If the information is insufficient, respond accordingly:
    ${JSON.stringify(similarProducts)}
    Answer in the following JSON FORMAT, NOTHING ELSE: { "text": "your_answer_here" }
    `;

    const schema = z.object({
      text: z.string(),
    });

    const response = await this.fetchLLM(system, prompt, schema);
    const productIds = similarProducts.map(
      (p) => p.payload!.productId as number,
    );
    return { text: response.text, productIds };
  }

  private async processProductSearchPrompt(
    prompt: string,
    lang: string,
  ): Promise<UserPromptResponse> {
    const embedding = (await this.fetchEmbedding(prompt))[0];

    const similarProducts = await this.qdrantService.qdrantClient.search(
      QdrantCollections.PRODUCTS,
      {
        vector: embedding,
        limit: 3,
        filter: {
          must: [
            {
              key: 'lang',
              match: { value: lang },
            },
          ],
        },
      },
    );

    if (similarProducts.length === 0) {
      throw new Error(this.i18nService.t('llm.consumer.noProductsFound'));
    }

    const system = `You are an AI assistant that provides a list of products based on a user's search criteria.
    Use the information from the following products to answer the user's prompt. Please formulate it to answer the user's questions. If the information is insufficient, respond accordingly:
    ${JSON.stringify(similarProducts)}
    Answer in the following JSON FORMAT, NOTHING ELSE: { "text": "your_answer_here" }
    `;

    const schema = z.object({
      text: z.string(),
    });

    const response = await this.fetchLLM(system, prompt, schema);
    const productIds = similarProducts.map(
      (p) => p.payload!.productId as number,
    );
    return { text: response.text, productIds };
  }

  private async generateProductInformationResponse(
    prompt: string,
    productId: number,
    lang: string,
  ): Promise<UserPromptResponse> {
    const embedding = (await this.fetchEmbedding(prompt))[0];

    const productContent = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        ProductTranslations: {
          where: {
            locale: lang,
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
      throw new Error(
        this.i18nService.t('llm.consumer.productNotFound', { lang }),
      );
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
            {
              key: 'lang',
              match: { value: lang },
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
      content: similarChunks.map(
        (chunk) => JSON.stringify(chunk.payload) || '',
      ),
    };

    const system = `You are an AI assistant that provides detailed information about products based on their name, description, variants and content.
    Use the following product information to answer the user's prompt:
    ${JSON.stringify(productInfo)}

    Answer the user's prompt using the provided product information. If the information is insufficient, respond accordingly.
    Answer in the following JSON FORMAT, NOTHING ELSE: { "text": "your_answer_here" }
    `;

    const schema = z.object({
      text: z.string(),
    });

    const response = await this.fetchLLM(system, prompt, schema);
    return { text: response.text, productIds: [] };
  }
}
