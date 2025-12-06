import { ContextType, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    switch (context.getType<ContextType | 'graphql'>()) {
      case 'http':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return context.switchToHttp().getRequest();
      case 'graphql':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        return GqlExecutionContext.create(context).getContext().req;
    }
  }
}
