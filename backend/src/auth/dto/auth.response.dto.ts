export class AuthResponseDto {
  constructor(
    accessToken: string,
    accessTokenExpirationSeconds: number,
    refreshToken: string,
    refreshTokenExpirationSeconds: number,
  ) {
    this.accessToken = accessToken;
    this.accessTokenExpirationSeconds = accessTokenExpirationSeconds;
    this.refreshToken = refreshToken;
    this.refreshTokenExpirationSeconds = refreshTokenExpirationSeconds;
  }

  accessToken: string;
  accessTokenExpirationSeconds: number;
  refreshToken: string;
  refreshTokenExpirationSeconds: number;
}
