import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { UserDto } from 'src/users/dto/user.dto';
import { Response } from 'express';
export declare class AuthService {
    private readonly configService;
    private readonly prismaService;
    private readonly usersService;
    private readonly jwtService;
    private readonly redisService;
    private readonly accessTokenExpirationInMiliseconds;
    private readonly refreshTokenExpirationInMiliseconds;
    private readonly accessTokenSecret;
    private readonly refreshTokenSecret;
    private readonly logger;
    constructor(configService: ConfigService, prismaService: PrismaService, usersService: UsersService, jwtService: JwtService, redisService: RedisService);
    validateUserWithCredentials(email: string, password: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastName: string | null;
        email: string;
        emailVerified: boolean;
        firstName: string | null;
    } | null>;
    verifyUserRefreshToken(refreshToken: string, userId: string): Promise<UserDto>;
    setAuthCookies(res: Response, accessToken: {
        token: string;
        expires: Date;
    }, refreshToken: {
        token: string;
        expires: Date;
    }): void;
    login(user: {
        id: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        accessTokenExpirationDate: Date;
        refreshTokenExpirationDate: Date;
    }>;
    getEmailVerificationKey(email: string): string;
    validateEmail(email: string, code: string): Promise<void>;
    sendEmailVerification(email: string): Promise<void>;
    private generateEmailVerificationCode;
    signOutAll(userId: string): Promise<void>;
    signOut(refreshToken: string): Promise<void>;
}
