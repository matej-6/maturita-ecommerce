"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDto = void 0;
class AuthResponseDto {
    constructor(accessToken, accessTokenExpirationDate, refreshToken, refreshTokenExpirationDate) {
        this.accessToken = accessToken;
        this.accessTokenExpirationDate = accessTokenExpirationDate;
        this.refreshToken = refreshToken;
        this.refreshTokenExpirationDate = refreshTokenExpirationDate;
    }
    accessToken;
    accessTokenExpirationDate;
    refreshToken;
    refreshTokenExpirationDate;
}
exports.AuthResponseDto = AuthResponseDto;
//# sourceMappingURL=auth.response.dto.js.map