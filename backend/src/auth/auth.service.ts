import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
import { generateRandomToken, hashPassword } from 'src/lib/hashing';
import { RedisService } from 'src/redis/redis.service';
import { SESSION_COOKIE_NAME } from 'src/constants';
@Injectable()
export class AuthService {
  private readonly sessionExpiration: number;

  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService<Env>,
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {
    this.sessionExpiration =
      this.configService.getOrThrow('SESSION_EXPIRATION');
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

    if (!!user && user.hashedPassword === hashedPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashedPassword, ...rest } = user;
      return this.usersService.toUserDTO(rest);
    }
    return null;
  }

  setAuthCookies(res: Response, sessionId: string, expiresAt: Date) {
    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: false,
      expires: expiresAt,
      sameSite: 'lax',
    });
  }

  async login(userId: number): Promise<AuthResponseDto> {
    const sessionId = generateRandomToken();
    const expiresAt = new Date(Date.now() + this.sessionExpiration * 1000);
    await this.redisService.client.set(sessionId, userId, {
      expiration: {
        type: 'EX',
        value: this.sessionExpiration,
      },
    });

    const activeSessions = await this.redisService.client.get(
      userId.toString(),
    );

    if (activeSessions) {
      const sessions = JSON.parse(activeSessions) as string[];
      sessions.push(sessionId);
      await this.redisService.client.set(
        userId.toString(),
        JSON.stringify(sessions),
        {
          expiration: {
            type: 'EX',
            value: this.sessionExpiration,
          },
        },
      );
    }

    return new AuthResponseDto(sessionId, expiresAt);
  }

  async signOutAll(userId: number) {
    const activeSessions = await this.redisService.client.get(
      userId.toString(),
    );

    if (activeSessions) {
      const sessions = JSON.parse(activeSessions) as string[];
      for (const sessionId of sessions) {
        await this.redisService.client.del(sessionId);
      }
      await this.redisService.client.del(userId.toString());
    }
  }

  async signOut(sessionId: string) {
    const userId = await this.redisService.client.get(sessionId);
    if (userId) {
      await this.redisService.client.del(sessionId);
      const activeSessions = await this.redisService.client.get(userId);
      if (activeSessions) {
        const sessions = JSON.parse(activeSessions) as string[];
        const updatedSessions = sessions.filter((id) => id !== sessionId);
        if (updatedSessions.length > 0) {
          await this.redisService.client.set(
            userId,
            JSON.stringify(updatedSessions),
            {
              expiration: {
                type: 'EX',
                value: this.sessionExpiration,
              },
            },
          );
        } else {
          await this.redisService.client.del(userId);
        }
      }
    }
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
      this.logger.error('Failed to register user:', error);
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

    try {
      await this.signOutAll(userId);
    } catch (error) {
      this.logger.error(
        `Failed to sign out user ${userId} during account deletion:`,
        error,
      );
    }

    await this.prismaService.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async getUserIdFromSession(sessionId: string): Promise<number | null> {
    const userId = await this.redisService.client.get(sessionId);
    if (userId) {
      return parseInt(userId, 10);
    }
    return null;
  }
}
