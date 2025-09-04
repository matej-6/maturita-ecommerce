import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { UserDto } from 'src/users/dto/user.dto';
import { Response } from 'express';
import { Role } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
export declare class AuthService {
    private readonly configService;
    private readonly prismaService;
    private readonly usersService;
    private readonly jwtService;
    private readonly redisService;
    private readonly accessTokenExpirationInSeconds;
    private readonly refreshTokenExpirationInSeconds;
    private readonly accessTokenSecret;
    private readonly refreshTokenSecret;
    private readonly logger;
    constructor(configService: ConfigService, prismaService: PrismaService, usersService: UsersService, jwtService: JwtService, redisService: RedisService);
    validateUserWithCredentials(email: string, password: string): Promise<UserDto | null>;
    verifyUserRefreshToken(refreshToken: string, userId: string): Promise<UserDto>;
    blacklistRefreshToken(refreshToken: string, userId: string): Promise<void>;
    setAuthCookies(res: Response, accessToken: {
        token: string;
        expires: Date;
    }, refreshToken: {
        token: string;
        expires: Date;
    }): void;
    login(user: {
        id: string;
        role: Role;
        email: string;
    }): Promise<AuthResponseDto>;
    getEmailVerificationKey(email: string): string;
    validateEmail(email: string, code: string): Promise<void>;
    sendEmailVerification(email: string): Promise<void>;
    private generateEmailVerificationCode;
    signOutAll(userId: string): Promise<void>;
    signOut(refreshToken: string, userId: string): Promise<void>;
    register(registerDto: RegisterDto): Promise<{
        id: string;
        email: string;
        emailVerified: boolean;
        hashedPassword: string | null;
        firstName: string | null;
        lastName: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
