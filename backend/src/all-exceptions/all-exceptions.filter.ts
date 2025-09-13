import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { exceptionBodyFormatter } from 'src/lib/exception-body-formatter';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response: Response = ctx.getResponse();
    response
      .status(exception.getStatus())
      .json(exceptionBodyFormatter(host, exception));
  }
}
