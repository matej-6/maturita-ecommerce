import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/validate';
import { QdrantClient } from '@qdrant/js-client-rest';

@Injectable()
export class QdrantService implements OnModuleInit {
  private client: QdrantClient;

  constructor(private readonly configService: ConfigService<Env>) {}

  get qdrantClient(): QdrantClient {
    return this.client;
  }

  async onModuleInit() {
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
      await this.client.createCollection(QdrantCollections.PRODUCT_CHUNKS, {
        vectors: {
          size: 2560, // https://github.com/QwenLM/Qwen3-Embedding?tab=readme-ov-file#qwen3-embedding-series-model-list
          distance: 'Cosine',
        },
      });
    }
    if (
      !collections.collections.find(
        (c) => c.name === QdrantCollections.PRODUCTS,
      )
    ) {
      await this.client.createCollection(QdrantCollections.PRODUCTS, {
        vectors: {
          size: 2560, //https://github.com/QwenLM/Qwen3-Embedding?tab=readme-ov-file#qwen3-embedding-series-model-list
          distance: 'Cosine',
        },
      });
    }
  }
}

export const QdrantCollections = {
  PRODUCT_CHUNKS: 'product_chunks',
  PRODUCTS: 'products',
};
