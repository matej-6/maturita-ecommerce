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
var JwtRefreshStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtRefreshStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const auth_service_1 = require("../auth.service");
let JwtRefreshStrategy = JwtRefreshStrategy_1 = class JwtRefreshStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh') {
    configService;
    authService;
    logger = new common_1.Logger(JwtRefreshStrategy_1.name);
    constructor(configService, authService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (req) => {
                    const refreshToken = req.headers['x-refresh-token'];
                    if (typeof refreshToken === 'string') {
                        this.logger.debug(`Extracted refresh token from Authorization header: ${refreshToken}`);
                        req.token = refreshToken;
                        return refreshToken;
                    }
                    return null;
                },
                (req) => {
                    const refreshToken = req.cookies?.Refresh;
                    if (typeof refreshToken === 'string') {
                        this.logger.debug(`Extracted refresh token from a cookie: ${refreshToken}`);
                        req.token = refreshToken;
                        return refreshToken;
                    }
                    return null;
                },
            ]),
            secretOrKey: configService.getOrThrow('JWT_REFRESH_SECRET'),
            passReqToCallback: true,
        });
        this.configService = configService;
        this.authService = authService;
    }
    async validate(req, payload) {
        this.logger.log(`Validating JWT refresh token for user ${payload.userId}`);
        this.logger.debug(`Payload: ${JSON.stringify(payload)}`);
        const refreshToken = req.token;
        const user = await this.authService.verifyUserRefreshToken(refreshToken, payload.userId);
        this.logger.debug(`User: ${JSON.stringify(user)}`);
        await this.authService.blacklistRefreshToken(refreshToken, user.id);
        return {
            id: user.id,
            role: user.role,
            email: user.email,
        };
    }
};
exports.JwtRefreshStrategy = JwtRefreshStrategy;
exports.JwtRefreshStrategy = JwtRefreshStrategy = JwtRefreshStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService])
], JwtRefreshStrategy);
//# sourceMappingURL=jwt-refresh.strategy.js.map