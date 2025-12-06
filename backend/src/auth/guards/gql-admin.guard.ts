import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { GraphqlAppContext } from 'src/app.module';
import { UnauthorizedException } from 'src/exception/unauthorized.exception';

@Injectable()
export class GqlAdminGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx =
      GqlExecutionContext.create(context).getContext<GraphqlAppContext>();

    if (ctx.user?.role !== 'ADMIN') {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return ctx.req as any;
  }
}
