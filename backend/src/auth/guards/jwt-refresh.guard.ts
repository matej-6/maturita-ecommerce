import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { GraphqlAppContext } from 'src/app.module';
import { Env } from 'src/config/validate';
import { ERROR } from 'src/errors';
import { hashToken } from 'src/lib/hashing';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshAuthGuard implements CanActivate {
  private refreshTokenSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env>,
    private readonly authService: AuthService,
  ) {
    this.refreshTokenSecret =
      this.configService.getOrThrow('JWT_REFRESH_SECRET');
  }

  private getRequest(context: ExecutionContext): Request | null {
    switch (context.getType<ContextType | 'graphql'>()) {
      case 'http': {
        return context.switchToHttp().getRequest<Request>();
      }
      case 'graphql': {
        return GqlExecutionContext.create(
          context,
        ).getContext<GraphqlAppContext>().req;
      }
      default: {
        return null;
      }
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    if (!request) {
      throw new UnauthorizedException(ERROR.unauthorizedException);
    }

    const token =
      this.extractTokenFromHeader(request) ||
      this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException(ERROR.unauthorizedException);
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ userId: number }>(
        token,
        {
          secret: this.refreshTokenSecret,
        },
      );
      const hashedToken = this.authService.hashToken(token);
      const { user, session } = await this.authService.verifyUserRefreshToken(
        hashedToken,
        payload.userId,
      );

      await this.authService.blacklistRefreshToken(session.id);
      request['user'] = user;
      if (context.getType<ContextType | 'graphql'>() === 'graphql') {
        const gqlContext =
          GqlExecutionContext.create(context).getContext<GraphqlAppContext>();
        gqlContext.user = user;
      }
    } catch {
      throw new UnauthorizedException(ERROR.unauthorizedException);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const refreshToken = request.headers['x-refresh-token'];
    if (typeof refreshToken === 'string') {
      return refreshToken;
    }
    return null;
  }

  private extractTokenFromCookie(request: Request): string | null {
    // eslint-disable-next-line
    const refreshToken = request.cookies?.Refresh;
    if (typeof refreshToken === 'string') {
      return refreshToken;
    }
    return null;
  }
}
