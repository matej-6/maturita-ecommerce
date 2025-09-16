"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const crypto = require("crypto");
const client_1 = require("@prisma/client");
const auth_response_dto_1 = require("./dto/auth.response.dto");
const EMAIL_VERIFICATION_KEY = 'email-verification';
const EMAIL_VERIFICATION_EXPIRATION_IN_SECONDS = 60 * 5;
let AuthService = AuthService_1 = class AuthService {
    configService;
    prismaService;
    usersService;
    jwtService;
    redisService;
    accessTokenExpirationInSeconds;
    refreshTokenExpirationInSeconds;
    accessTokenSecret;
    refreshTokenSecret;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(configService, prismaService, usersService, jwtService, redisService) {
        this.configService = configService;
        this.prismaService = prismaService;
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.redisService = redisService;
        this.accessTokenExpirationInSeconds = this.configService.getOrThrow('JWT_ACCESS_EXPIRATION_IN_SECONDS');
        this.refreshTokenExpirationInSeconds = this.configService.getOrThrow('JWT_REFRESH_EXPIRATION_IN_SECONDS');
        this.accessTokenSecret =
            this.configService.getOrThrow('JWT_ACCESS_SECRET');
        this.refreshTokenSecret =
            this.configService.getOrThrow('JWT_REFRESH_SECRET');
    }
    async validateUserWithCredentials(email, password) {
        const user = await this.usersService.findOneByEmail(email);
        if (user &&
            user.hashedPassword &&
            (await bcrypt.compare(password, user.hashedPassword))) {
            const { hashedPassword, ...rest } = user;
            return rest;
        }
        return null;
    }
    async verifyUserRefreshToken(refreshToken, userId) {
        try {
            const refreshTokenSessions = await this.prismaService.refreshTokenSession.findMany({
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
                this.logger.warn(`No refresh token sessions found for this user id: ${userId}`);
                throw new common_1.UnauthorizedException();
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
                this.logger.warn(`No refresh token sessions matches for this user id: ${userId}`);
                throw new common_1.UnauthorizedException();
            }
            if (refreshTokenSession.blacklisted === true) {
                this.logger.warn(`Blacklisted refresh token used: ${refreshToken} by user with id: ${userId}`);
                await this.signOutAll(refreshTokenSession.userId);
                throw new common_1.UnauthorizedException();
            }
            return refreshTokenSession.user;
        }
        catch (error) {
            this.logger.error('Error verifying user refresh token: ', error instanceof Error ? error.message : JSON.stringify(error));
            throw new common_1.UnauthorizedException();
        }
    }
    async blacklistRefreshToken(refreshToken, userId) {
        try {
            const refreshTokenSessions = await this.prismaService.refreshTokenSession.findMany({
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
        }
        catch (error) {
            this.logger.error('Error blacklisting refresh token: ', error);
        }
    }
    setAuthCookies(res, accessToken, refreshToken) {
        res.cookie('Authentication', accessToken.token, {
            httpOnly: true,
            secure: this.configService.getOrThrow('NODE_ENV') ===
                'production',
            expires: accessToken.expires,
            sameSite: 'lax',
        });
        res.cookie('Refresh', refreshToken.token, {
            httpOnly: true,
            secure: this.configService.getOrThrow('NODE_ENV') ===
                'production',
            expires: refreshToken.expires,
            sameSite: 'lax',
        });
    }
    async login(user) {
        try {
            const accessTokenExpirationSeconds = this.accessTokenExpirationInSeconds;
            const refreshTokenExpirationSeconds = this.refreshTokenExpirationInSeconds;
            const accessTokenExpirationDate = new Date(Date.now() + accessTokenExpirationSeconds * 1000);
            const refreshTokenExpirationDate = new Date(Date.now() + refreshTokenExpirationSeconds * 1000);
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
            const refreshTokenPayload = {
                userId: user.id,
            };
            const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
                expiresIn: `${this.accessTokenExpirationInSeconds.toString()}s`,
                secret: this.accessTokenSecret,
            });
            const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
                expiresIn: `${this.refreshTokenExpirationInSeconds.toString()}s`,
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
                    blacklisted: false,
                },
            });
            return new auth_response_dto_1.AuthResponseDto(accessToken, accessTokenExpirationSeconds, refreshToken, refreshTokenExpirationSeconds);
        }
        catch (error) {
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('unknownError');
        }
    }
    getEmailVerificationKey(email) {
        return `${EMAIL_VERIFICATION_KEY}:${email}`;
    }
    async validateEmail(email, code) {
        const key = this.getEmailVerificationKey(email);
        const redisClient = this.redisService.client;
        const value = await redisClient.get(key);
        if (!value || value !== code) {
            throw new common_1.BadRequestException('Invalid verification code.');
        }
        redisClient.del(key).catch((error) => {
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
        }
        catch (error) {
            this.logger.error('Failed to update user email verification status.', error);
            throw new common_1.InternalServerErrorException('Something went wrong.');
        }
    }
    async sendEmailVerification(email) {
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
            throw new common_1.BadRequestException('Something went wrong.');
        }
        if (user.emailVerified) {
            this.logger.warn(`User with already verified email tried to verify email: ${email}`);
            throw new common_1.BadRequestException('Email already verified.');
        }
        let code;
        try {
            code = this.generateEmailVerificationCode(6);
        }
        catch (error) {
            this.logger.error('Failed to generate email verification code.', error);
            throw new common_1.InternalServerErrorException('Something went wrong.');
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
        }
        catch (error) {
            this.logger.error('Failed to set email verification code.', error);
            throw new common_1.InternalServerErrorException('Something went wrong.');
        }
    }
    generateEmailVerificationCode(length = 6) {
        const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
        const resultArray = new Array(length).fill(0);
        const clen = characters.length;
        for (let i = 0; i < length; i++) {
            resultArray[i] = characters[crypto.randomInt(0, clen)];
        }
        return resultArray.join('');
    }
    async signOutAll(userId) {
        try {
            await this.prismaService.refreshTokenSession.deleteMany({
                where: {
                    user: {
                        id: userId,
                    },
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to sign out all.', error);
            throw new common_1.InternalServerErrorException('unknownError');
        }
    }
    async signOut(refreshToken, userId) {
        const refreshTokenSessions = await this.prismaService.refreshTokenSession.findMany({
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
                    this.logger.warn(`Blacklisted refresh token used: ${refreshToken} by user with id: ${userId}`);
                    await this.signOutAll(userId);
                    this.logger.warn('Invalid refresh token used.');
                    throw new common_1.BadRequestException('badRequest');
                }
                await this.prismaService.refreshTokenSession.update({
                    where: {
                        id: session.id,
                    },
                    data: {
                        blacklisted: true,
                    },
                });
                return;
            }
        }
        throw new common_1.BadRequestException('badRequest');
    }
    async register(registerDto) {
        try {
            const user = await this.prismaService.user.create({
                data: {
                    firstName: registerDto.firstName,
                    lastName: registerDto.lastName,
                    email: registerDto.email,
                    hashedPassword: await bcrypt.hash(registerDto.password, 10),
                    role: client_1.Role.USER,
                },
            });
            return user;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.BadRequestException('emailAlreadyInUse');
                }
            }
            this.logger.error('Failed to register user.', error);
            throw new common_1.InternalServerErrorException('unknownError');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        users_service_1.UsersService,
        jwt_1.JwtService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map