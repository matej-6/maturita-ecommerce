import * as crypto from 'crypto';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}
