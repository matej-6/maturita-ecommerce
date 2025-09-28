import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from 'generated/prisma/client';
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
        (req: Request) => {
          const bearerToken = req.headers.authorization?.split(' ')[1];
          if (typeof bearerToken === 'string') {
            this.logger.debug(
              `Extracted Authentication token from Authorization header: ${bearerToken}`,
            );
            return bearerToken;
          }
          return null;
        },
        (request: Request) => {
          // eslint-disable-next-line
          const token = request.cookies?.Authentication;
          if (typeof token === 'string') {
            this.logger.debug(
              `Extracted Authentication token from cookies: ${token}`,
            );
            return token;
          }
          return null;
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
