import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env } from 'src/config/validate';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService<Env>) {
        return {
          connection: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            username: configService.get('REDIS_USERNAME'),
            password: configService.get('REDIS_PASSWORD'),
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: 'llm-tasks',
    }),
  ],
  exports: [BullModule],
})
export class BullConfigModule {}
