import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { GraphqlAppContext } from '../app.module';
import { Request } from 'express';

export type OptionalCurrentUserDto = AuthenticatedUserDto | null;

export const OptionalCurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): OptionalCurrentUserDto => {
    switch (context.getType<ContextType | 'graphql'>()) {
      case 'http': {
        const req = context
          .switchToHttp()
          .getRequest<Request & { user?: AuthenticatedUserDto }>();

        return req.user || null;
      }
      case 'graphql': {
        const ctx =
          GqlExecutionContext.create(context).getContext<GraphqlAppContext>();
        const req = ctx.req as unknown as { user?: AuthenticatedUserDto };
        return req.user || null;
      }
      default:
        return null;
    }
  },
);
