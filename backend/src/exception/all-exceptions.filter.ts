import {
  ArgumentsHost,
  Catch,
  ContextType,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { GraphQLError } from 'graphql';
import { I18nContext } from 'nestjs-i18n';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exc: HttpException, host: ArgumentsHost) {
    const i18n = I18nContext.current();

    const message: string =
      i18n?.t(exc.message, { defaultValue: undefined }) || exc.message;

    this.logger.debug(`
      response: {
        message: ${message},
        statusCode: ${exc.getStatus()}
      }
      `);

    switch (host.getType<ContextType | 'graphql'>()) {
      case 'http': {
        const response = host.switchToHttp().getResponse<Response>();
        response.status(exc.getStatus()).send({
          statusCode: exc.getStatus(),
          message: message,
        });
        break;
      }
      case 'graphql':
        throw new GraphQLError(message, {
          extensions: {
            statusCode: exc.getStatus(),
          },
        });
    }
  }
}
