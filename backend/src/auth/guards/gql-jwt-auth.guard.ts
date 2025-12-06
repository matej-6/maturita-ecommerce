import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(GqlExecutionContext.name);
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    this.logger.debug('gql execution ctx', ctx.getContext().req);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return ctx.getContext().req;
  }
}
