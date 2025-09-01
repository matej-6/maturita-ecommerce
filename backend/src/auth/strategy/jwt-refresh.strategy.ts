import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from 'src/config/validate';
import { AuthService } from '../auth.service';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { RequestWithToken } from './request-with-token.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private readonly logger = new Logger(JwtRefreshStrategy.name);

  constructor(
    private readonly configService: ConfigService<Env>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const bearerToken = req.headers.authorization?.split(' ')[1];

          if (typeof bearerToken === 'string') {
            this.logger.debug(
              `Extracted refresh token from Authorization header: ${bearerToken}`,
            );
            (req as RequestWithToken).token = bearerToken;
            return bearerToken;
          }
          return null;
        },
        (req: Request) => {
          // eslint-disable-next-line
          const refreshToken = req.cookies?.Refresh;
          if (typeof refreshToken === 'string') {
            this.logger.debug(
              `Extracted refresh token from a cookie: ${refreshToken}`,
            );
            (req as RequestWithToken).token = refreshToken;
            return refreshToken;
          }
          return null;
        },
      ]),
      secretOrKey: configService.getOrThrow('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: RequestWithToken,
    payload: { userId: string },
  ): Promise<AuthenticatedUserDto> {
    this.logger.log(`Validating JWT refresh token for user ${payload.userId}`);

    this.logger.debug(`Payload: ${JSON.stringify(payload)}`);

    const refreshToken = req.token;

    const user = await this.authService.verifyUserRefreshToken(
      refreshToken,
      payload.userId,
    );

    this.logger.debug(`User: ${JSON.stringify(user)}`);

    await this.authService.blacklistRefreshToken(refreshToken, user.id);

    return {
      id: user.id,
      role: user.role,
      email: user.email,
    };
  }
}
