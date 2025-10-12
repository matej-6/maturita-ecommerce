import { ArgumentsHost, HttpException } from '@nestjs/common';
import { I18nValidationException } from 'nestjs-i18n';
import { I18nContext } from 'nestjs-i18n';

export function exceptionBodyFormatter(
  host: ArgumentsHost,
  exception: HttpException,
): Record<string, unknown> {
  const i18n = I18nContext.current();
  let fieldErrors: Map<string, string[]> | undefined = undefined;

  if (exception instanceof I18nValidationException) {
    fieldErrors = new Map();
    exception.message =
      i18n?.t('error.badRequest', {
        defaultValue: '',
      }) || '';
    exception.errors.forEach((e) => {
      const errors = new Map<string, string>(
        e.constraints ? Object.entries(e.constraints) : [],
      );
      fieldErrors!.set(e.property, Array.from(errors.values()));
    });
  } else {
    const defaultMessage = 'An unknown error occurred';

    exception.message =
      i18n?.t(`error.${exception.message}`, {
        defaultValue: '',
      }) ||
      i18n?.t('error.unknownError', { defaultValue: '' }) ||
      defaultMessage;
  }

  const res = {
    message: exception.message,
    status: exception.getStatus(),
    fieldErrors: fieldErrors && Object.fromEntries(fieldErrors),
  };

  console.log(res.message);
  return res;
}
