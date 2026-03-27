import { NestFactory } from '@nestjs/core';
import { SeedService } from './seed/seed.service';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.init();
  const seedService = app.get(SeedService);
  await seedService.seed(true);
}

void bootstrap();
