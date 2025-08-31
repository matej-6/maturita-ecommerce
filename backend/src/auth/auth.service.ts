import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/validate';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import * as crypto from 'crypto';
import { UserDto } from 'src/users/dto/user.dto';
import { Response } from 'express';
import { Prisma, Role } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';

const EMAIL_VERIFICATION_KEY = 'email-verification';
const EMAIL_VERIFICATION_EXPIRATION_IN_SECONDS = 60 * 5;

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
    private readonly redisService: RedisService,
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
    const user = await this.usersService.findOneByEmail(email);
    if (
      user &&
      user.hashedPassword &&
      (await bcrypt.compare(password, user.hashedPassword))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashedPassword, ...rest } = user;
      return rest;
    }
    return null;
  }

  async verifyUserRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<UserDto> {
    try {
      const refreshTokenSessions =
        await this.prismaService.refreshTokenSession.findMany({
          where: {
            expiresAt: {
              gte: new Date(Date.now()),
            },
            userId: userId,
          },
          include: {
            user: {
              omit: {
                hashedPassword: true,
              },
            },
          },
        });

      if (refreshTokenSessions.length === 0) {
        this.logger.warn(
          `No refresh token sessions found for this user id: ${userId}`,
        );
        throw new UnauthorizedException();
      }

      let refreshTokenSession = null;

      for (const session of refreshTokenSessions) {
        const isValid = await bcrypt.compare(refreshToken, session.token);
        if (isValid) {
          refreshTokenSession = session;
          break;
        }
      }
      if (refreshTokenSession === null) {
        this.logger.warn(
          `No refresh token sessions matches for this user id: ${userId}`,
        );
        throw new UnauthorizedException();
      }

      if (refreshTokenSession.blacklisted === true) {
        this.logger.warn(
          `Blacklisted refresh token used: ${refreshToken} by user with id: ${userId}`,
        );
        await this.signOutAll(refreshTokenSession.userId);
        throw new UnauthorizedException();
      }

      return refreshTokenSession.user;
    } catch (error) {
      this.logger.error(
        'Error verifying user refresh token: ',
        error instanceof Error ? error.message : JSON.stringify(error),
      );
      throw new UnauthorizedException();
    }
  }

  async blacklistRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<void> {
    try {
      const refreshTokenSessions =
        await this.prismaService.refreshTokenSession.findMany({
          where: {
            expiresAt: {
              gte: new Date(),
            },
            userId: userId,
          },
        });

      for (const session of refreshTokenSessions) {
        const isValid = await bcrypt.compare(refreshToken, session.token);
        if (isValid) {
          await this.prismaService.refreshTokenSession.update({
            where: {
              id: session.id,
            },
            data: {
              blacklisted: true,
            },
          });
          break;
        }
      }
    } catch (error) {
      this.logger.error('Error blacklisting refresh token: ', error);
    }
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
      secure:
        this.configService.getOrThrow<Env['NODE_ENV']>('NODE_ENV') ===
        'production',
      expires: accessToken.expires,
      sameSite: 'lax',
    });

    res.cookie('Refresh', refreshToken.token, {
      httpOnly: true,
      secure:
        this.configService.getOrThrow<Env['NODE_ENV']>('NODE_ENV') ===
        'production',
      expires: refreshToken.expires,
      sameSite: 'lax',
    });
  }

  async login(user: { id: string; role: Role; email: string }): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpirationDate: Date;
    refreshTokenExpirationDate: Date;
  }> {
    try {
      const accessTokenExpirationDate = new Date(
        Date.now() + this.accessTokenExpirationInSeconds * 1000,
      );
      const refreshTokenExpirationDate = new Date(
        Date.now() + this.refreshTokenExpirationInSeconds * 1000,
      );

      this.logger.debug(`
        Generating tokens for user ID: ${user.id} with role: ${user.role}
        Access Token Expires at ${accessTokenExpirationDate.toUTCString()} (in ${this.accessTokenExpirationInSeconds} seconds)
        Refresh Token Expires at ${refreshTokenExpirationDate.toUTCString()} (in ${this.refreshTokenExpirationInSeconds} seconds)
      `);

      const accessTokenPayload = {
        userId: user.id,
        role: user.role,
        email: user.email,
      };

      const refreshTokenPayload = {
        userId: user.id,
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

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      await this.prismaService.refreshTokenSession.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          token: hashedRefreshToken,
          expiresAt: refreshTokenExpirationDate,
          blacklisted: false,
        },
      });

      return {
        accessToken,
        refreshToken,
        accessTokenExpirationDate,
        refreshTokenExpirationDate,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to login');
    }
  }

  getEmailVerificationKey(email: string) {
    return `${EMAIL_VERIFICATION_KEY}:${email}`;
  }

  async validateEmail(email: string, code: string) {
    const key = this.getEmailVerificationKey(email);
    const redisClient = this.redisService.client;

    const value = await redisClient.get(key);

    if (!value || value !== code) {
      throw new BadRequestException('Invalid verification code.');
    }

    redisClient.del(key).catch((error: any) => {
      this.logger.error('Failed to delete email verification code.', error);
    });

    try {
      await this.prismaService.user.update({
        data: {
          emailVerified: true,
        },
        where: {
          email: email,
        },
      });
    } catch (error) {
      this.logger.error(
        'Failed to update user email verification status.',
        error,
      );
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async sendEmailVerification(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        emailVerified: true,
      },
    });

    if (!user) {
      this.logger.warn(`Nonexistent user tried to verify email: ${email}`);
      throw new BadRequestException('Something went wrong.');
    }

    if (user.emailVerified) {
      this.logger.warn(
        `User with already verified email tried to verify email: ${email}`,
      );
      throw new BadRequestException('Email already verified.');
    }

    let code: string;

    try {
      code = this.generateEmailVerificationCode(6);
    } catch (error) {
      this.logger.error('Failed to generate email verification code.', error);
      throw new InternalServerErrorException('Something went wrong.');
    }

    const key = this.getEmailVerificationKey(email);

    const redisClient = this.redisService.client;

    try {
      await redisClient.set(key, code, {
        expiration: {
          type: 'EX',
          value: EMAIL_VERIFICATION_EXPIRATION_IN_SECONDS,
        },
      });
      this.logger.debug(`Verification code for email ${email} is ${code}.`);
    } catch (error) {
      this.logger.error('Failed to set email verification code.', error);
      throw new InternalServerErrorException('Something went wrong.');
    }

    // TODO: Send email with code
  }

  private generateEmailVerificationCode(length: number = 6) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyz';

    const resultArray = new Array(length).fill(0);
    const clen = characters.length;

    for (let i = 0; i < length; i++) {
      resultArray[i] = characters[crypto.randomInt(0, clen)];
    }

    return resultArray.join('');
  }

  async signOutAll(userId: string) {
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
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  async signOut(refreshToken: string, userId: string) {
    const refreshTokenSessions =
      await this.prismaService.refreshTokenSession.findMany({
        where: {
          userId: userId,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

    for (const session of refreshTokenSessions) {
      const isValid = await bcrypt.compare(refreshToken, session.token);
      if (isValid) {
        if (session.blacklisted) {
          this.logger.warn(
            `Blacklisted refresh token used: ${refreshToken} by user with id: ${userId}`,
          );
          await this.signOutAll(userId);
          throw new BadRequestException('Invalid refresh token.');
        }
        await this.prismaService.refreshTokenSession.update({
          where: {
            id: session.id,
          },
          data: {
            blacklisted: true,
          },
        });
        return; // Successfully blacklisted the token
      }
    }

    throw new BadRequestException('Invalid refresh token.');
  }

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          email: registerDto.email,
          hashedPassword: await bcrypt.hash(registerDto.password, 10),
          role: Role.USER,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('This email is already in use.');
        }
      }
      this.logger.error('Failed to register user.', error);
      throw new InternalServerErrorException(
        'Something went wrong. Please try again.',
      );
    }
  }
}
