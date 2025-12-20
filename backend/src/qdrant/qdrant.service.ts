import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/validate';
import { QdrantClient } from '@qdrant/js-client-rest';

@Injectable()
export class QdrantService implements OnModuleInit {
  private readonly logger = new Logger(QdrantService.name);

  private client: QdrantClient;

  constructor(private readonly configService: ConfigService<Env>) {
    console.log('QdrantService constructor called');
  }

  get qdrantClient(): QdrantClient {
    return this.client;
  }

  async onModuleInit() {
    console.log('QdrantService initialized');
    this.logger.log('Initializing Qdrant client...');

    const qdrantHost = this.configService.getOrThrow<string>('QDRANT_HOST');
    const qdrantPort = this.configService.getOrThrow<number>('QDRANT_PORT');

    this.client = new QdrantClient({
      host: qdrantHost,
      port: qdrantPort,
    });
    const collections = await this.client.getCollections();
    if (
      !collections.collections.find(
        (c) => c.name === QdrantCollections.PRODUCT_CHUNKS,
      )
    ) {
      await this.createProductChunksCollection();
    }
    if (
      !collections.collections.find(
        (c) => c.name === QdrantCollections.PRODUCTS,
      )
    ) {
      await this.createProductCollection();
    }
  }

  private async createProductChunksCollection() {
    await this.client.createCollection(QdrantCollections.PRODUCT_CHUNKS, {
      vectors: {
        size: 2560, // https://github.com/QwenLM/Qwen3-Embedding?tab=readme-ov-file#qwen3-embedding-series-model-list
        distance: 'Cosine',
      },
    });
  }

  private async createProductCollection() {
    await this.client.createCollection(QdrantCollections.PRODUCTS, {
      vectors: {
        size: 2560, //https://github.com/QwenLM/Qwen3-Embedding?tab=readme-ov-file#qwen3-embedding-series-model-list
        distance: 'Cosine',
      },
    });
  }

  async clearProductCollections() {
    await this.client.deleteCollection(QdrantCollections.PRODUCTS);
    await this.client.deleteCollection(QdrantCollections.PRODUCT_CHUNKS);
    await this.createProductCollection();
    await this.createProductChunksCollection();
  }
}

export const QdrantCollections = {
  PRODUCT_CHUNKS: 'product_chunks',
  PRODUCTS: 'products',
};
