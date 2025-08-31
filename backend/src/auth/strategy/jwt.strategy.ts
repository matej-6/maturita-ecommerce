import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from 'src/config/validate';
import { UsersService } from 'src/users/users.service';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService<Env>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (request: Request) => {
          let token = null;
          if (request.cookies?.Authentication) {
            token = request.cookies.Authentication as string;
            this.logger.debug(`Extracted JWT from cookies: ${token}`);
          }
          return token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.getOrThrow('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: {
    userId: string;
    role: Role;
    email: string;
  }): AuthenticatedUserDto {
    this.logger.debug(`Validating JWT payload for user ID: ${payload.userId}`);
    return {
      id: payload.userId,
      role: payload.role,
      email: payload.email,
    };
  }
}
