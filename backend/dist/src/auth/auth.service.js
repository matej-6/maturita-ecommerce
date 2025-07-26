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
let AuthService = AuthService_1 = class AuthService {
    configService;
    prismaService;
    usersService;
    jwtService;
    accessTokenExpirationInMiliseconds;
    refreshTokenExpirationInMiliseconds;
    accessTokenSecret;
    refreshTokenSecret;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(configService, prismaService, usersService, jwtService) {
        this.configService = configService;
        this.prismaService = prismaService;
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.accessTokenExpirationInMiliseconds = this.configService.getOrThrow('JWT_ACCESS_EXPIRATION_IN_SECONDS');
        this.refreshTokenExpirationInMiliseconds = this.configService.getOrThrow('JWT_REFRESH_EXPIRATION_IN_SECONDS');
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
    async login(user) {
        try {
            const accessTokenExpirationDate = new Date(Date.now() + this.accessTokenExpirationInMiliseconds);
            const refreshTokenExpirationDate = new Date(Date.now() + this.refreshTokenExpirationInMiliseconds);
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
        }
        catch (error) {
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('Failed to login');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map