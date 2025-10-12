import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Response } from 'express';
import { ERROR } from 'src/errors';
import { exceptionBodyFormatter } from 'src/lib/exception-body-formatter';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exc: HttpException, host: ArgumentsHost) {
    console.log('exc', exc);

    const exception =
      exc instanceof HttpException
        ? exc
        : new HttpException(
            ERROR.unknownError,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );

    const res = exceptionBodyFormatter(host, exception);
    const gqlHost = GqlArgumentsHost.create(host);
    if (gqlHost.getContext() != null) return res;

    const ctx = host.switchToHttp();

    const response: Response = ctx.getResponse();

    response.status(exception.getStatus()).json(res);
  }
}
