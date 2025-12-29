import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ERROR } from 'src/errors';
import { Role } from 'generated/prisma/enums';
import { Request } from 'express';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      throw new UnauthorizedException(ERROR.unauthorizedException);
    }

    const request = super.getRequest(context) as Request;
    const user = request['user'] as AuthenticatedUserDto;

    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException(ERROR.unauthorizedException);
    }
    return true;
  }
}
