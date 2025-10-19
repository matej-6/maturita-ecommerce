import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { GraphqlAppContext } from '../app.module';
import { Request } from 'express';

type CurrentUser = AuthenticatedUserDto;

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    switch (context.getType<ContextType | 'graphql'>()) {
      case 'http': {
        const req = context
          .switchToHttp()
          .getRequest<Request & { user?: CurrentUser }>();

        return req.user || null;
      }
      case 'graphql': {
        const ctx =
          GqlExecutionContext.create(context).getContext<GraphqlAppContext>();
        const req = ctx.req as { user?: CurrentUser };
        return req.user || null;
      }
    }
  },
);
