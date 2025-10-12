import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Response } from 'express';
import { GraphQLError } from 'graphql';
import { I18nValidationException } from 'nestjs-i18n';
import { exceptionBodyFormatter } from 'src/lib/exception-body-formatter';

@Catch(I18nValidationException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const res = exceptionBodyFormatter(host, exception);

    console.log('here 1');

    const gqlHost = GqlArgumentsHost.create(host);
    if (gqlHost.getContext() != null) {
      return new GraphQLError(exception.message, {
        extensions: {
          ...res,
        },
      });
    }

    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    response.status(exception.getStatus()).json(res);
  }
}
