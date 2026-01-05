import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateUserInput } from './dto/update-user.input';
import { UserDto } from './dto/user.dto';
import { Role, User, UserAvatar } from 'generated/prisma/client';
import { PaginationArgs } from 'src/lib/pagination.args';
import { UserFindAllQueryArgs, UserSortingArgs } from './user.resolver.args';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { PaginatedUser } from './entities/user.entity';
import { ERROR } from 'src/errors';
import { hashPassword } from 'src/lib/hashing';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    let hashedPassword = hashPassword(createUserInput.password);

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
        throw new BadRequestException(ERROR.emailAlreadyInUse);
      }
      throw new InternalServerErrorException(ERROR.unknownError);
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
      throw new InternalServerErrorException(ERROR.unknownError);
    }
  }

  async update(id: number, input: UpdateUserInput): Promise<UserDto> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          email: input.email,
          firstName: input.name,
          lastName: input.lastName,
        },
        omit: {
          hashedPassword: true,
        },
      });
      return user;
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new BadRequestException(ERROR.emailAlreadyInUse);
      }
      this.logger.error('Failed to update user: ', err);
      throw new InternalServerErrorException(ERROR.unknownError);
    }
  }

  async updateUserRole(userId: number, newRole: Role): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
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
      throw new InternalServerErrorException(ERROR.unknownError);
    }
  }

  async findOne(id: number): Promise<UserDto | null> {
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
      throw new InternalServerErrorException(ERROR.unknownError);
    }
  }

  async uploadAvatar(
    userId: number,
    base64: string,
    mimeType: string,
  ): Promise<void> {
    await this.prisma.userAvatar.upsert({
      where: {
        userId: userId,
      },
      create: {
        userId: userId,
        base64: base64,
        mimeType: mimeType,
      },
      update: {
        base64: base64,
        mimeType: mimeType,
      },
    });
  }

  async deleteAvatar(userId: number): Promise<void> {
    await this.prisma.userAvatar.deleteMany({
      where: {
        userId: userId,
      },
    });
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException(ERROR.badRequest);
    }

    const newHashedPassword = hashPassword(newPassword);
    if (user.hashedPassword === newHashedPassword) {
      throw new BadRequestException('users.service.currentPasswordIncorrect');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedPassword: newHashedPassword },
    });
  }

  async getAvatar(userId: number): Promise<UserAvatar | null> {
    return (
      (await this.prisma.userAvatar.findFirst({
        where: { userId },
      })) ?? null
    );
  }

  async findAllPaginated(
    paginationArgs: PaginationArgs,
    findAllQueryArgs: UserFindAllQueryArgs,
    sortByArgs: UserSortingArgs,
    user: AuthenticatedUserDto,
  ): Promise<PaginatedUser> {
    if (user.role !== 'ADMIN') {
      throw new BadRequestException('Unauthorized');
    }
    paginationArgs.validateFields();
    const users = await this.prisma.user.findMany({
      where: {
        id: findAllQueryArgs.id ? findAllQueryArgs.id : undefined,
        email: findAllQueryArgs.email
          ? {
              contains: findAllQueryArgs.email,
            }
          : undefined,
        role: findAllQueryArgs.role ? findAllQueryArgs.role : undefined,
      },
      orderBy: sortByArgs.sortBy
        ? {
            [sortByArgs.sortBy]: sortByArgs.ascending ? 'asc' : 'desc',
          }
        : {
            id: 'asc',
          },
      omit: {
        hashedPassword: true,
      },
      take: paginationArgs.pageSize + 1,
      cursor: paginationArgs.cursor ? { id: paginationArgs.cursor } : undefined,
    });

    const hasNextPage = users.length > paginationArgs.pageSize;
    if (hasNextPage) {
      users.pop();
    }

    return {
      hasNextPage,
      totalCount: users.length,
      edges: users.map((user) => ({
        cursor: user.id,
        node: user,
      })),
    };
  }
}
