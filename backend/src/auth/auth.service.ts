import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/validate';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/users/dto/user.dto';
import { Response } from 'express';
import { Role } from 'generated/prisma/client';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import { ERROR } from 'src/errors';
import { hashPassword, hashToken } from 'src/lib/hashing';
@Injectable()
export class AuthService {
  private readonly accessTokenExpirationInSeconds: number;
  private readonly refreshTokenExpirationInSeconds: number;

  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.accessTokenExpirationInSeconds = this.configService.getOrThrow<
      Env['JWT_ACCESS_EXPIRATION_IN_SECONDS']
    >('JWT_ACCESS_EXPIRATION_IN_SECONDS');
    this.refreshTokenExpirationInSeconds = this.configService.getOrThrow<
      Env['JWT_REFRESH_EXPIRATION_IN_SECONDS']
    >('JWT_REFRESH_EXPIRATION_IN_SECONDS');
    this.accessTokenSecret =
      this.configService.getOrThrow<Env['JWT_ACCESS_SECRET']>(
        'JWT_ACCESS_SECRET',
      );
    this.refreshTokenSecret =
      this.configService.getOrThrow<Env['JWT_REFRESH_SECRET']>(
        'JWT_REFRESH_SECRET',
      );
  }

  async validateUserWithCredentials(
    email: string,
    password: string,
  ): Promise<UserDto | null> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    const hashedPassword = hashPassword(password);

    if (user && user.hashedPassword === hashedPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashedPassword, ...rest } = user;
      return this.usersService.toUserDTO(rest);
    }
    return null;
  }

  async verifyUserRefreshToken(hashedToken: string, userId: number) {
    const refreshTokenSession =
      await this.prismaService.refreshTokenSession.findFirst({
        where: {
          userId: userId,
          token: hashedToken,
        },
        include: {
          user: {
            omit: {
              hashedPassword: true,
            },
          },
        },
      });

    if (!refreshTokenSession) {
      this.logger.warn(
        `No refresh token sessions found for this user id: ${userId}`,
      );
      throw new UnauthorizedException(ERROR.unauthorizedException);
    }

    if (refreshTokenSession.expiresAt < new Date()) {
      this.logger.warn('Expired refresh token used.');
      throw new UnauthorizedException(ERROR.unauthorizedException);
    }

    if (refreshTokenSession.blacklisted === true) {
      this.logger.warn(
        `Blacklisted refresh token used by user with id: ${userId}`,
      );
      await this.signOutAll(refreshTokenSession.userId);
      throw new UnauthorizedException(ERROR.unauthorizedException);
    }

    return { user: refreshTokenSession.user, session: refreshTokenSession };
  }

  async blacklistRefreshToken(sessionId: number): Promise<void> {
    await this.prismaService.refreshTokenSession.update({
      where: {
        id: sessionId,
      },
      data: {
        blacklisted: true,
      },
    });
  }

  setAuthCookies(
    res: Response,
    accessToken: {
      token: string;
      expires: Date;
    },
    refreshToken: {
      token: string;
      expires: Date;
    },
  ) {
    res.cookie('Authentication', accessToken.token, {
      httpOnly: true,
      secure: false,
      expires: accessToken.expires,
      sameSite: 'lax',
    });

    res.cookie('Refresh', refreshToken.token, {
      httpOnly: true,
      secure: false,
      expires: refreshToken.expires,
      sameSite: 'lax',
    });
  }

  async login(user: {
    id: number;
    role: Role;
    email: string;
  }): Promise<AuthResponseDto> {
    try {
      const accessTokenExpirationSeconds = this.accessTokenExpirationInSeconds;
      const refreshTokenExpirationSeconds =
        this.refreshTokenExpirationInSeconds;

      const accessTokenExpirationDate = new Date(
        Date.now() + accessTokenExpirationSeconds * 1000,
      );
      const refreshTokenExpirationDate = new Date(
        Date.now() + refreshTokenExpirationSeconds * 1000,
      );

      this.logger.debug(`
        Generating tokens for user ID: ${user.id} with role: ${user.role}
        Access Token Expires at ${accessTokenExpirationDate.toUTCString()} (in ${accessTokenExpirationSeconds} seconds)
        Refresh Token Expires at ${refreshTokenExpirationDate.toUTCString()} (in ${refreshTokenExpirationSeconds} seconds)
      `);

      const accessTokenPayload = {
        userId: user.id,
        role: user.role,
        email: user.email,
      };

      const refreshTokenSession =
        await this.prismaService.refreshTokenSession.create({
          data: {
            user: {
              connect: {
                id: user.id,
              },
            },
            token: '',
            expiresAt: refreshTokenExpirationDate,
            blacklisted: false,
          },
        });

      const refreshTokenPayload = {
        userId: user.id,
        sessionId: refreshTokenSession.id,
      };

      const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
        expiresIn: `${this.accessTokenExpirationInSeconds.toString()}s`,
        secret: this.accessTokenSecret,
      });

      const refreshToken = await this.jwtService.signAsync(
        refreshTokenPayload,
        {
          expiresIn: `${this.refreshTokenExpirationInSeconds.toString()}s`,
          secret: this.refreshTokenSecret,
        },
      );

      const hashedRefreshToken = this.hashToken(refreshToken);

      await this.prismaService.refreshTokenSession.update({
        where: {
          id: refreshTokenSession.id,
        },
        data: {
          token: hashedRefreshToken,
        },
      });

      return new AuthResponseDto(
        accessToken,
        accessTokenExpirationSeconds,
        refreshToken,
        refreshTokenExpirationSeconds,
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(ERROR.unknownError);
    }
  }

  hashToken(token: string): string {
    return hashToken(token);
  }

  async signOutAll(userId: number) {
    try {
      await this.prismaService.refreshTokenSession.deleteMany({
        where: {
          user: {
            id: userId,
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to sign out all.', error);
      throw new InternalServerErrorException(ERROR.unknownError);
    }
  }

  async signOut(refreshToken: string, userId: number) {
    const hashedRefreshToken = this.hashToken(refreshToken);

    await this.prismaService.refreshTokenSession.delete({
      where: {
        userId: userId,
        token: hashedRefreshToken,
      },
    });
  }

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          email: registerDto.email,
          hashedPassword: hashPassword(registerDto.password),
          role: Role.USER,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(ERROR.emailAlreadyInUse);
        }
      }
      this.logger.error('Failed to register user.', error);
      throw new InternalServerErrorException(ERROR.unknownError);
    }
  }

  async deleteAccount(userId: number) {
    const pendingOrders = await this.prismaService.order.findMany({
      where: {
        userId: userId,
        status: {
          in: ['PENDING', 'PROCESSING', 'SHIPPED'],
        },
      },
    });

    if (pendingOrders.length > 0) {
      throw new BadRequestException('auth.service.deleteAccount.pendingOrders');
    }

    await this.prismaService.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
