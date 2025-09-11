import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {
  I18nMiddleware,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from 'nestjs-i18n';
import { AllExceptionsFilter } from './all-exceptions/all-exceptions.filter';
import { exceptionBodyFormatter } from './lib/exception-body-formatter';

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
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new I18nValidationExceptionFilter({
      detailedErrors: false,
      responseBodyFormatter(host, exc, formattedErrors) {
        return exceptionBodyFormatter(host, exc);
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
