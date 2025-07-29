import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';
import { UpdateUserInput } from './dto/update-user.input';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    } catch (err) {
      this.logger.error('Failed to hash password: ', err);
      throw new InternalServerErrorException('Failed to hash password');
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          firstName: createUserInput.name,
          lastName: createUserInput.lastName,
          email: createUserInput.email,
          hashedPassword: hashedPassword,
        },
      });
      this.logger.log(`User created: ${user.id}`);
      return user;
    } catch (err: unknown) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new BadRequestException('Email already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (err) {
      this.logger.error('Failed to find user by email: ', err);
      throw new InternalServerErrorException(
        'Something went wrong. Please try again.',
      );
    }
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<UserDto> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserInput,
        omit: {
          hashedPassword: true,
        },
      });
      this.logger.log(`User updated: ${user.id}`);
      return user;
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new BadRequestException('Email already in use');
      }
      this.logger.error('Failed to update user: ', err);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      this.logger.log(`User deleted: ${id}`);
    } catch (err) {
      this.logger.error('Failed to delete user: ', err);
      throw new InternalServerErrorException(
        'Something went wrong. Please try again.',
      );
    }
  }

  async findAll(): Promise<UserDto[]> {
    try {
      const users: UserDto[] = await this.prisma.user.findMany({
        omit: {
          hashedPassword: true,
        },
      });
      return users;
    } catch (err) {
      this.logger.error('Failed to find all users: ', err);
      throw new InternalServerErrorException(
        'Something went wrong. Please try again.',
      );
    }
  }

  async findOne(id: string): Promise<UserDto | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        omit: {
          hashedPassword: true,
        },
      });
      return user;
    } catch (err) {
      this.logger.error('Failed to find user: ', err);
      throw new InternalServerErrorException(
        'Something went wrong. Please try again.',
      );
    }
  }
}
