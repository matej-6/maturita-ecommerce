import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { GraphqlAppContext } from 'src/app.module';
import { ERROR } from 'src/errors';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { SESSION_COOKIE_NAME } from 'src/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersSerivce: UsersService,
  ) {}

  getRequest(context: ExecutionContext): Request {
    switch (context.getType<ContextType | 'graphql'>()) {
      case 'http':
        return context.switchToHttp().getRequest();
      case 'graphql':
        return GqlExecutionContext.create(
          context,
        ).getContext<GraphqlAppContext>().req;
      default:
        throw new UnauthorizedException(ERROR.unauthorizedException);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const sessionId =
      this.extractSessionFromHeader(request) ||
      this.extractSessionFromCookie(request);
    if (!sessionId) {
      throw new UnauthorizedException(ERROR.unauthorizedException);
    }
    const userId = await this.authService.getUserIdFromSession(sessionId);

    if (!userId) {
      throw new UnauthorizedException(ERROR.unauthorizedException);
    }

    const user = await this.usersSerivce.findOne(userId);
    if (!user) {
      throw new UnauthorizedException(ERROR.unauthorizedException);
    }

    const authUser: AuthenticatedUserDto = {
      id: user.id,
      email: user.email,
      role: user.role,
      sessionId: sessionId,
    };

    request['user'] = authUser;
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      const gqlContext =
        GqlExecutionContext.create(context).getContext<GraphqlAppContext>();
      gqlContext.user = authUser;
    }
    return true;
  }

  private extractSessionFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const sessionToken = authHeader.slice(7).trim();
    if (sessionToken) {
      return sessionToken;
    }
    return null;
  }

  private extractSessionFromCookie(request: Request): string | null {
    const token = request.cookies?.[SESSION_COOKIE_NAME] as string | undefined;
    if (typeof token === 'string') {
      return token;
    }
    return null;
  }
}
