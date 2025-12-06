import {
  ArgumentsHost,
  Catch,
  ContextType,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { GraphQLError } from 'graphql';
import { I18nContext } from 'nestjs-i18n';
import { ERROR } from 'src/errors';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const i18n = I18nContext.current();

    this.logger.error(exception);

    const message: string =
      i18n?.t('error.' + ERROR.unknownError) || ERROR.unknownError;
    const statusCode = 500;
    this.logger.debug(`
            response: {
              message: ${message},
              statusCode: ${statusCode}
            }
            `);

    switch (host.getType<ContextType | 'graphql'>()) {
      case 'http': {
        const response = host.switchToHttp().getResponse<Response>();
        response.status(statusCode).send({
          statusCode: statusCode,
          message: message,
        });
        break;
      }
      case 'graphql':
        throw new GraphQLError(message, {
          extensions: {
            statusCode: statusCode,
          },
        });
    }
  }
}
