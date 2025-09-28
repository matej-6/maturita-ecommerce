import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserInput } from './dto/update-user.input';
import { UserDto } from './dto/user.dto';
import { User } from 'generated/prisma/client';
export declare class UsersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createUserInput: CreateUserInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        role: import("generated/prisma/client").Role;
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
