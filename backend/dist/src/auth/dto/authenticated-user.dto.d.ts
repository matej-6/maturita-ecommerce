import { Role } from 'generated/prisma/client';
export type AuthenticatedUserDto = {
    id: string;
    role: Role;
    email: string;
};
