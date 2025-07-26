import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/validate';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import * as crypto from 'crypto';

const EMAIL_VERIFICATION_KEY = 'email-verification';
const EMAIL_VERIFICATION_EXPIRATION_IN_SECONDS = 60 * 5;

@Injectable()
export class AuthService {
  private readonly accessTokenExpirationInMiliseconds: number;
  private readonly refreshTokenExpirationInMiliseconds: number;

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
    this.accessTokenExpirationInMiliseconds = this.configService.getOrThrow<
      Env['JWT_ACCESS_EXPIRATION_IN_SECONDS']
    >('JWT_ACCESS_EXPIRATION_IN_SECONDS');
    this.refreshTokenExpirationInMiliseconds = this.configService.getOrThrow<
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

  async validateUserWithCredentials(email: string, password: string) {
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

  async login(user: { id: string }): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpirationDate: Date;
    refreshTokenExpirationDate: Date;
  }> {
    try {
      const accessTokenExpirationDate = new Date(
        Date.now() + this.accessTokenExpirationInMiliseconds,
      );
      const refreshTokenExpirationDate = new Date(
        Date.now() + this.refreshTokenExpirationInMiliseconds,
      );

      const tokenPayload = {
        userId: user.id,
      };

      const accessToken = await this.jwtService.signAsync(tokenPayload, {
        expiresIn: `${this.accessTokenExpirationInMiliseconds}ms`,
        secret: this.accessTokenSecret,
      });

      const refreshToken = await this.jwtService.signAsync(tokenPayload, {
        expiresIn: `${this.refreshTokenExpirationInMiliseconds}ms`,
        secret: this.refreshTokenSecret,
      });

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

    const value = await redisClient.getDel(key);

    if (!value || value !== code) {
      throw new BadRequestException('Invalid verification code.');
    }

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

  async signOut(refreshToken: string) {
    try {
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.prismaService.refreshTokenSession.delete({
        where: {
          token: hashedRefreshToken,
        },
      });
    } catch (error) {
      this.logger.error('Failed to sign out.', error);
      throw new InternalServerErrorException('Something went wrong.');
    }
  }
}
