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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const auth_service_1 = require("./auth.service");
const common_1 = require("@nestjs/common");
const auth_response_1 = require("./dto/auth.response");
const auth_input_1 = require("./dto/auth.input");
const users_service_1 = require("../users/users.service");
const config_1 = require("@nestjs/config");
const verifyEmail_input_1 = require("./dto/verifyEmail.input");
const graphql_scalars_1 = require("graphql-scalars");
const current_user_decorator_1 = require("./current-user.decorator");
const jwt_refresh_guard_1 = require("./guards/jwt-refresh.guard");
const me_response_1 = require("./dto/me.response");
const gql_jwt_auth_guard_1 = require("./guards/gql-jwt-auth.guard");
let AuthResolver = AuthResolver_1 = class AuthResolver {
    authService;
    usersService;
    configService;
    logger = new common_1.Logger(AuthResolver_1.name);
    constructor(authService, usersService, configService) {
        this.authService = authService;
        this.usersService = usersService;
        this.configService = configService;
    }
    async refreshToken({ res }, user) {
        const { accessToken, refreshToken, accessTokenExpirationDate, refreshTokenExpirationDate, } = await this.authService.login(user);
        this.authService.setAuthCookies(res, { token: accessToken, expires: accessTokenExpirationDate }, { token: refreshToken, expires: refreshTokenExpirationDate });
    }
    async login(authInput, { res }) {
        const user = await this.authService.validateUserWithCredentials(authInput.email, authInput.password);
        if (!user) {
            throw new common_1.BadRequestException('Invalid email or password');
        }
        const { accessToken, refreshToken, accessTokenExpirationDate, refreshTokenExpirationDate, } = await this.authService.login(user);
        res.cookie('Authentication', accessToken, {
            httpOnly: true,
            secure: this.configService.getOrThrow('NODE_ENV') ===
                'production',
            expires: accessTokenExpirationDate,
        });
        res.cookie('Refresh', refreshToken, {
            httpOnly: true,
            secure: this.configService.getOrThrow('NODE_ENV') ===
                'production',
            expires: refreshTokenExpirationDate,
        });
        return user;
    }
    async verifyEmail(verifyEmailInput) {
        await this.authService.validateEmail(verifyEmailInput.email, verifyEmailInput.code);
    }
    async requestEmailVerification(user) {
        await this.authService.sendEmailVerification(user.email);
    }
    async logoutAll({ res }, user) {
        await this.authService.signOutAll(user.id);
        res.clearCookie('Authentication');
        res.clearCookie('Refresh');
    }
    async me(user) {
        const foundUser = await this.usersService.findOne(user.id);
        if (!foundUser) {
            throw new common_1.NotFoundException();
        }
        return me_response_1.MeResponse.fromUser(foundUser);
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, common_1.UseGuards)(jwt_refresh_guard_1.JwtRefreshAuthGuard),
    (0, graphql_1.Mutation)(() => graphql_scalars_1.GraphQLVoid),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "refreshToken", null);
__decorate([
    (0, graphql_1.Mutation)(() => auth_response_1.AuthResponse),
    __param(0, (0, graphql_1.Args)('authInput')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_input_1.AuthInput, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Mutation)(() => graphql_scalars_1.GraphQLVoid),
    __param(0, (0, graphql_1.Args)('verifyEmailInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verifyEmail_input_1.VerifyEmailInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Mutation)(() => graphql_scalars_1.GraphQLVoid),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "requestEmailVerification", null);
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Mutation)(() => graphql_scalars_1.GraphQLVoid),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "logoutAll", null);
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Query)(() => me_response_1.MeResponse),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "me", null);
exports.AuthResolver = AuthResolver = AuthResolver_1 = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        config_1.ConfigService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map