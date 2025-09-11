import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext, I18nValidationException } from 'nestjs-i18n';

@Catch(HttpException)
export class GeneralFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const i18n = I18nContext.current(host);
    const ctx = host.switchToHttp();

    console.log(exception);

    let message: string | undefined;
    let errors: unknown[] = [];

    if (exception instanceof I18nValidationException) {
      errors = exception.errors;
    } else {
      message = i18n?.t(`error.${exception.message}`);
    }

    const response: Response = ctx.getResponse();
    response.json({
      message,
      status: exception.getResponse(),
      errors,
    });
  }
}
