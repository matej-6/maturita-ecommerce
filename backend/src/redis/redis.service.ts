import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { Env } from 'src/config/validate';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Awaited<ReturnType<typeof createClient>>;
  private readonly logger = new Logger(RedisService.name);

  onModuleInit() {
    this.logger.log('Initializing Redis client...');
    const redisDatabase =
      this.configService.get<Env['REDIS_DATABASE']>('REDIS_DATABASE');

    createClient({
      username:
        this.configService.getOrThrow<Env['REDIS_USERNAME']>('REDIS_USERNAME'),
      password:
        this.configService.getOrThrow<Env['REDIS_PASSWORD']>('REDIS_PASSWORD'),
      socket: {
        host: this.configService.getOrThrow<Env['REDIS_HOST']>('REDIS_HOST'),
        port: this.configService.getOrThrow<Env['REDIS_PORT']>('REDIS_PORT'),
      },
      ...(redisDatabase ? { database: redisDatabase } : {}),
    })
      .connect()
      .then((client) => {
        this.redisClient = client;
        client.on('error', (err) => {
          this.logger.error(err);
        });
      })
      .catch((err) => {
        this.logger.error(err);
      });
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting Redis client...');
    await this.redisClient.quit();
  }

  constructor(private readonly configService: ConfigService) {}

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string) {
    return this.redisClient.set(key, value);
  }

  get client(): Awaited<ReturnType<typeof createClient>> {
    return this.redisClient;
  }
}
