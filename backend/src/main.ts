import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { I18nMiddleware, I18nValidationPipe } from 'nestjs-i18n';
import { AllExceptionsFilter } from './exception/all-exceptions.filter';
import { ValidationFilter } from './validation/validation.filter';
import { ErrorFilter } from './exception/error.filter';
import { json } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.enableCors({
    origin: process.env.ORIGIN || [
      'http://localhost:3000',
      'googleusercontent.com',
    ],
    credentials: true,
  });
  app.use(cookieParser());

  app.use(I18nMiddleware);
  app.useBodyParser('json', { limit: '10mb' });
  // app.use(json({ limit: '10mb' }));

  app.useGlobalFilters(
    new ErrorFilter(),
    new AllExceptionsFilter(),
    new ValidationFilter(),
  );

  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      validateCustomDecorators: true,
      enableDebugMessages: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
