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
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private accessTokenSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env>,
  ) {
    this.accessTokenSecret = this.configService.getOrThrow('JWT_ACCESS_SECRET');
  }

  getRequest(context: ExecutionContext) {
    switch (context.getType<ContextType | 'graphql'>()) {
      case 'http':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return context.switchToHttp().getRequest();
      case 'graphql':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        return GqlExecutionContext.create(
          context,
        ).getContext<GraphqlAppContext>().req;
    }
  }

  setUser(payload: AuthenticatedUserDto, context: ExecutionContext) {
    switch (context.getType<ContextType | 'graphql'>()) {
      case 'http': {
        const httpRequest = context.switchToHttp().getRequest<Request>();
        httpRequest['user'] = payload;
        break;
      }
      case 'graphql': {
        const gqlContext =
          GqlExecutionContext.create(context).getContext<GraphqlAppContext>();
        gqlContext.user = payload;
        break;
      }
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context) as Request;
    const tokenFromHeader =
      this.extractTokenFromHeader(request) ||
      this.extractTokenFromCookie(request);
    if (!tokenFromHeader) {
      throw new UnauthorizedException(ERROR.unauthorizedException);
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = await this.jwtService.verifyAsync(tokenFromHeader, {
        secret: this.accessTokenSecret,
      });

      const user = {
        id: payload.userId,
        role: payload.role,
        email: payload.email,
      };

      request['user'] = user as AuthenticatedUserDto;
      if (context.getType<ContextType | 'graphql'>() === 'graphql') {
        const gqlContext =
          GqlExecutionContext.create(context).getContext<GraphqlAppContext>();
        gqlContext.user = user as AuthenticatedUserDto;
      }
    } catch {
      throw new UnauthorizedException(ERROR.unauthorizedException);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const bearerToken = request.headers.authorization?.split(' ')[1];
    if (typeof bearerToken === 'string') {
      return bearerToken;
    }
    return null;
  }

  private extractTokenFromCookie(request: Request): string | null {
    const token = request.cookies?.Authentication;
    if (typeof token === 'string') {
      return token;
    }
    return null;
  }
}
