import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateUserInput } from './dto/update-user.input';
import { UserDto } from './dto/user.dto';
import { Role, User } from 'generated/prisma/client';
import { PaginationArgs } from 'src/lib/pagination.args';
import { UserFindAllQueryArgs, UserSortingArgs } from './user.resolver.args';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { PaginatedUser } from './entities/user.entity';
import { ERROR } from 'src/errors';
import { hashPassword } from 'src/lib/hashing';
import { ImageStorageService } from 'src/image-storage/image-storage.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private prisma: PrismaService,
    private imageStorageService: ImageStorageService,
  ) {}

  toUserDTO(user: Omit<User, 'hashedPassword'>): UserDto {
    return {
      createdAt: user.createdAt,
      email: user.email,
      firstName: user.firstName,
      id: user.id,
      lastName: user.lastName,
      role: user.role,
      updatedAt: user.updatedAt,
      avatarUrl: user.avatarFileName
        ? this.imageStorageService.getImageUrl(user.avatarFileName)
        : null,
    };
  }

  async create(createUserInput: CreateUserInput): Promise<UserDto> {
    const hashedPassword = hashPassword(createUserInput.password);

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
      return this.toUserDTO(user);
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

  async findOneByEmail(email: string): Promise<UserDto | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) return null;
      return this.toUserDTO(user);
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
      });
      return this.toUserDTO(user);
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
      const users = await this.prisma.user.findMany({
        omit: {
          hashedPassword: true,
        },
      });
      return users.map((u) => this.toUserDTO(u));
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

      if (!user) return null;
      return this.toUserDTO(user);
    } catch (err) {
      this.logger.error('Failed to find user: ', err);
      throw new InternalServerErrorException(ERROR.unknownError);
    }
  }

  async uploadAvatar(
    userId: number,
    file: {
      buffer: Buffer;
      mimeType: string;
    },
  ): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        avatarFileName: true,
      },
    });

    if (!user) {
      throw new BadRequestException(ERROR.badRequest);
    }

    if (user.avatarFileName) {
      await this.imageStorageService.deleteImage(user.avatarFileName);
    }

    const fileName = this.imageStorageService.getImageFileName(file);
    await this.imageStorageService.saveImageFile(fileName, file.buffer);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarFileName: fileName,
      },
    });
  }

  async deleteAvatar(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.avatarFileName) {
      throw new BadRequestException(ERROR.badRequest);
    }

    await this.imageStorageService.deleteImage(user.avatarFileName);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarFileName: null,
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
    const currHashedPassword = hashPassword(currentPassword);
    if (user.hashedPassword !== currHashedPassword) {
      throw new BadRequestException('users.service.currentPasswordIncorrect');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedPassword: newHashedPassword },
    });
  }

  getAvatarUrl(avatarFileName: string): string {
    return this.imageStorageService.getImageUrl(avatarFileName);
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
    let nextCursor: number | null = null;
    if (hasNextPage) {
      const lastUser = users.pop();
      nextCursor = lastUser ? lastUser.id : null;
    }

    return {
      nextCursor,
      totalCount: users.length,
      edges: users.map((user) => ({
        cursor: user.id,
        node: this.toUserDTO(user),
      })),
    };
  }
}
