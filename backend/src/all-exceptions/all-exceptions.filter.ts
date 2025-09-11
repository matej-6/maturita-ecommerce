import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const i18n = I18nContext.current(host);
    const ctx = host.switchToHttp();
    const defaultMessage = 'An unknown error occurred';

    const message: string =
      i18n?.t(`error.${exception.message}`, {
        defaultValue: defaultMessage,
      }) ?? defaultMessage;

    exception.message = message;

    const response: Response = ctx.getResponse();
    response.status(exception.getStatus()).json({
      message,
      status: exception.getStatus(),
    });
  }
}
