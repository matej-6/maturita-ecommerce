import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserInput: CreateUserInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.Role;
        email: string;
        emailVerified: boolean;
        hashedPassword: string | null;
        firstName: string | null;
        lastName: string | null;
        avatar: string | null;
    }>;
    findAll(): Promise<import("./dto/user.dto").UserDto[]>;
    findOne(id: string): Promise<import("./dto/user.dto").UserDto | null>;
    updateUser(updateUserInput: UpdateUserInput): Promise<import("./dto/user.dto").UserDto>;
    removeUser(id: string): Promise<void>;
}
