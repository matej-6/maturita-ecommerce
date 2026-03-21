export class AuthResponseDto {
  constructor(sessionId: string, expiresAt: Date) {
    this.sessionId = sessionId;
    this.expiresAt = expiresAt;
  }

  sessionId: string;
  expiresAt: Date;
}
