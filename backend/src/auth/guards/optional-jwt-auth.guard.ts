import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';

export class OptionalJwtAuthGuard extends JwtAuthGuard {
  override handleRequest<TUser = AuthenticatedUserDto | null>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user || null;
  }
}
