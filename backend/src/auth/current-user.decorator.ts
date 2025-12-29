import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { GraphqlAppContext } from '../app.module';
import { Request } from 'express';
import { UnauthorizedException } from 'src/exception/unauthorized.exception';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    switch (context.getType<ContextType | 'graphql'>()) {
      case 'http': {
        const req = context
          .switchToHttp()
          .getRequest<Request & { user?: AuthenticatedUserDto }>();

        if (!req.user) throw new UnauthorizedException();
        return req.user;
      }
      case 'graphql': {
        const ctx =
          GqlExecutionContext.create(context).getContext<GraphqlAppContext>();
        if (!ctx.user) throw new UnauthorizedException();
        return ctx.user;
      }
      default:
        throw new UnauthorizedException();
    }
  },
);
