import type { User } from '@prisma/client';
export declare class UpdateUserInput implements Partial<User> {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}
