import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { AppContext } from '../app.module';

type CurrentUser = AuthenticatedUserDto;

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    try {
      const ctx = GqlExecutionContext.create(context);
      const gqlContext = ctx.getContext<AppContext>();
      const req = gqlContext.req as { user?: CurrentUser };

      if (req.user) {
        return req.user;
      }
    } catch {
      const req = context.switchToHttp().getRequest<{ user?: CurrentUser }>();
      if (!req.user) {
        throw new Error('User not found. Did you forget to use the AuthGuard?');
      }

      return req.user;
    }
  },
);
