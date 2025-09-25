import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserInput } from './dto/update-user.input';
import { UserDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createUserInput: CreateUserInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.Role;
        lastName: string | null;
        email: string;
        emailVerified: boolean;
        hashedPassword: string | null;
        firstName: string | null;
        avatar: string | null;
    }>;
    findOneByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserInput: UpdateUserInput): Promise<UserDto>;
    remove(id: string): Promise<void>;
    findAll(): Promise<UserDto[]>;
    findOne(id: string): Promise<UserDto | null>;
}
