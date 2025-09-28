import { Role } from 'generated/prisma/client';
import { UserDto } from 'src/users/dto/user.dto';
export declare class MeResponse implements UserDto {
    static fromUser(user: UserDto): MeResponse;
    id: string;
    email: string;
    emailVerified: boolean;
    firstName: string | null;
    lastName: string | null;
    role: Role;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}
