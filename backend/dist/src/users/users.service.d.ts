import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserInput } from './dto/update-user.input';
export declare class UsersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createUserInput: CreateUserInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastName: string | null;
        email: string;
        hashedPassword: string | null;
        firstName: string | null;
    }>;
    findOneByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserInput: UpdateUserInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastName: string | null;
        email: string;
        hashedPassword: string | null;
        firstName: string | null;
    }>;
    remove(id: string): Promise<void>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
}
