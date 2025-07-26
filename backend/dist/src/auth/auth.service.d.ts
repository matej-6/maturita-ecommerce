import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class AuthService {
    private readonly configService;
    private readonly prismaService;
    private readonly usersService;
    private readonly jwtService;
    private readonly accessTokenExpirationInMiliseconds;
    private readonly refreshTokenExpirationInMiliseconds;
    private readonly accessTokenSecret;
    private readonly refreshTokenSecret;
    private readonly logger;
    constructor(configService: ConfigService, prismaService: PrismaService, usersService: UsersService, jwtService: JwtService);
    validateUserWithCredentials(email: string, password: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastName: string | null;
        email: string;
        firstName: string | null;
    } | null>;
    login(user: {
        id: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        accessTokenExpirationDate: Date;
        refreshTokenExpirationDate: Date;
    }>;
}
