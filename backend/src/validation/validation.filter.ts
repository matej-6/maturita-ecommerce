import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { GraphQLError } from 'graphql';
import { I18nContext, I18nValidationException } from 'nestjs-i18n';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils';

// docs: https://github.com/toonvanstrijp/nestjs-i18n/blob/f1f8a583752f67f64fb3cab1924fdbc877652864/src/filters/i18n-validation-exception.filter.ts
@Catch(I18nValidationException)
export class ValidationFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationFilter.name);

  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = I18nContext.current();

    const errors = formatI18nErrors(exception.errors ?? [], i18n!.service, {
      lang: i18n!.lang,
    });

    this.logger.debug('errors: ', errors);

    const formattedErrors: Record<string, string[]> = {};

    errors
      .filter((e) => e.constraints !== undefined)
      .forEach((e) => {
        formattedErrors[e.property] = Array.from(
          Object.entries(e.constraints!).values(),
        ).map((v) => v[1]);
      });

    this.logger.debug('formatted errors', formattedErrors);

    switch (host.getType() as string) {
      case 'http': {
        const response = host.switchToHttp().getResponse<Response>();
        response.status(exception.getStatus()).send({
          message: exception.getResponse(),
          statusCode: HttpStatus.BAD_REQUEST,
          fieldErrors: formattedErrors,
        });
        break;
      }
      case 'graphql':
        throw new GraphQLError(exception.message, {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
            fieldErrors: formattedErrors,
          },
        });
    }
  }
}
