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
    if (!collections.collections.find((c) => c.name === 'product_chunks')) {
      await this.client.createCollection('product_chunks', {
        vectors: {
          size: 2560, // https://github.com/QwenLM/Qwen3-Embedding?tab=readme-ov-file#qwen3-embedding-series-model-list
          distance: 'Cosine',
        },
      });
    }
    if (!collections.collections.find((c) => c.name === 'products')) {
      await this.client.createCollection('products', {
        vectors: {
          size: 2560, //https://github.com/QwenLM/Qwen3-Embedding?tab=readme-ov-file#qwen3-embedding-series-model-list
          distance: 'Cosine',
        },
      });
    }
  }
}
