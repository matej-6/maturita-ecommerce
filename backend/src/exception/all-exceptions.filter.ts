import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { GraphQLError } from 'graphql';
import { I18nContext } from 'nestjs-i18n';
import { ERROR } from 'src/errors';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exc: HttpException, host: ArgumentsHost) {
    this.logger.debug('exception: ', exc);

    const i18n = I18nContext.current();

    const message: string =
      i18n?.t(exc.message, { defaultValue: undefined }) ||
      i18n?.t(ERROR.unknownError) ||
      ERROR.unknownError;

    switch (host.getType() as string) {
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
