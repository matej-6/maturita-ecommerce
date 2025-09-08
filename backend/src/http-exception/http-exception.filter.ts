import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

// sources:
// https://docs.nestjs.com/exception-filters#exception-filters-1
// https://nestjs-i18n.com/guides/exception-filters

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const i18n = I18nContext.current(host);
    console.log('Http exception filter exception: ', exception);
    let errorMessage = '';
    if (i18n !== undefined) {
      let message = i18n.t(`error.${exception.message}`);
      if (message == `error.${exception.message}`) {
        message = i18n.t(`error.unknownError`);
      }
      errorMessage = message;
    }

    response.status(exception.getStatus()).json({
      errorMessage,
      ...exception,
    });
  }
}
