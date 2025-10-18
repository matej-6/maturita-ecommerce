import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { I18nMiddleware, I18nValidationPipe } from 'nestjs-i18n';
import { AllExceptionsFilter } from './exception/all-exceptions.filter';
import { ValidationFilter } from './validation/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ORIGIN || [
      'http://localhost:3000',
      'googleusercontent.com',
    ],
    credentials: true,
  });
  app.use(cookieParser());

  app.use(I18nMiddleware);

  app.useGlobalFilters(new AllExceptionsFilter(), new ValidationFilter());

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
