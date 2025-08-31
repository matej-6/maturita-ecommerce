import { Role } from '@prisma/client';

export type AuthenticatedUserDto = {
  id: string;
  role: Role;
  email: string;
};
