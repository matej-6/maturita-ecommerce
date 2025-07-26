import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { GqlContextType, GqlExceptionFilter } from '@nestjs/graphql';
import { Response } from 'express';
import z, { ZodError } from 'zod';

@Catch(ZodError)
export class ZodFilter<T extends ZodError>
  implements ExceptionFilter, GqlExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<Response>();
      const status = HttpStatus.BAD_REQUEST;
      const message = z.prettifyError(exception);
      res.status(status).json({
        message: message,
        status: status,
        extensions: {
          code: 'BAD_REQUEST',
          message: message,
        },
      });
      return;
    } else if (host.getType<GqlContextType>() === 'graphql') {
      throw new Error(
        JSON.stringify({
          message: exception.message,
          status: HttpStatus.BAD_REQUEST,
          errors: exception.issues.map((issue) => issue.message),
        }),
      );
    }
    throw exception;
  }
}
