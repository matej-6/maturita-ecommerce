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
      useFactory(configService: ConfigService<Env, true>) {
        return {
          connection: {
            url: configService.get('REDIS_URL'),
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
