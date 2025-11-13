import { Role } from 'generated/prisma/client';

export type AuthenticatedUserDto = {
  id: number;
  role: Role;
  email: string;
};
