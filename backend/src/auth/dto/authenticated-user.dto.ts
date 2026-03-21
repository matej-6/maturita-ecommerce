import { Role } from 'generated/prisma/client';

export type AuthenticatedUserDto = {
  id: number;
  sessionId: string;
  role: Role;
  email: string;
};
