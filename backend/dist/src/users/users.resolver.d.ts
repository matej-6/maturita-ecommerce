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
        lastName: string | null;
        email: string;
        hashedPassword: string | null;
        firstName: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastName: string | null;
        email: string;
        hashedPassword: string | null;
        firstName: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastName: string | null;
        email: string;
        hashedPassword: string | null;
        firstName: string | null;
    } | null>;
    updateUser(updateUserInput: UpdateUserInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastName: string | null;
        email: string;
        hashedPassword: string | null;
        firstName: string | null;
    }>;
    removeUser(id: string): Promise<void>;
}
