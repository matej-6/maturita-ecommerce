import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  handleRequest<TUser = AuthenticatedUserDto>(
    err: any,
    user: AuthenticatedUserDto | null | undefined,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (user == null || user.role !== 'ADMIN') {
      throw new UnauthorizedException();
    }

    return user as TUser;
  }
}
