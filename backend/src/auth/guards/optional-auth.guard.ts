import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';

export class OptionalAuthGuard extends AuthGuard {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
    } catch {
      const request = super.getRequest(context);
      request['user'] = undefined;
    }
    return true;
  }
}
