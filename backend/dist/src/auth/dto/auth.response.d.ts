import { UserDto } from 'src/users/dto/user.dto';
export declare class AuthResponse implements Partial<UserDto> {
    id: string;
    email: string;
    emailVerified: boolean;
    firstName: string | null;
    lastName: string | null;
    createdAt: Date;
    updatedAt: Date;
}
