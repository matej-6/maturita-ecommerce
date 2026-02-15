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
    const redisUrl = this.configService.get('REDIS_URL', {
      infer: true,
    });

    createClient({
      url: redisUrl,
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

  constructor(private readonly configService: ConfigService<Env, true>) {}

  get client(): Awaited<ReturnType<typeof createClient>> {
    return this.redisClient;
  }
}
