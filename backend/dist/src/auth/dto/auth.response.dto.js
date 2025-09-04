"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDto = void 0;
class AuthResponseDto {
    constructor(accessToken, accessTokenExpirationSeconds, refreshToken, refreshTokenExpirationSeconds) {
        this.accessToken = accessToken;
        this.accessTokenExpirationSeconds = accessTokenExpirationSeconds;
        this.refreshToken = refreshToken;
        this.refreshTokenExpirationSeconds = refreshTokenExpirationSeconds;
    }
    accessToken;
    accessTokenExpirationSeconds;
    refreshToken;
    refreshTokenExpirationSeconds;
}
exports.AuthResponseDto = AuthResponseDto;
//# sourceMappingURL=auth.response.dto.js.map