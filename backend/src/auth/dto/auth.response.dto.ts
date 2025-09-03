export class AuthResponseDto {
  constructor(
    accessToken: string,
    accessTokenExpirationDate: Date,
    refreshToken: string,
    refreshTokenExpirationDate: Date,
  ) {
    this.accessToken = accessToken;
    this.accessTokenExpirationDate = accessTokenExpirationDate;
    this.refreshToken = refreshToken;
    this.refreshTokenExpirationDate = refreshTokenExpirationDate;
  }

  accessToken: string;
  accessTokenExpirationDate: Date;
  refreshToken: string;
  refreshTokenExpirationDate: Date;
}
