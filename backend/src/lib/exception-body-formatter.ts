import { ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { I18nValidationException } from 'nestjs-i18n';

export function exceptionBodyFormatter(
  host: ArgumentsHost,
  exception: HttpException,
): Record<string, unknown> {
  let fieldErrors = new Map();
  if (exception instanceof I18nValidationException) {
    exception.errors.forEach((e) => {
      const errors = e.constraints as unknown as Map<string, string>;
      fieldErrors.set(e.property, errors);
    });
  }

  console.log('field Errors: ', fieldErrors);

  return {
    message: exception.message,
    status: exception.getStatus(),
  };
}
