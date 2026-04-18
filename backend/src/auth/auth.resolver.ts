import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Logger, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { GraphQLVoid } from 'graphql-scalars';
import { CurrentUser } from './current-user.decorator';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'me' })
  async me(@CurrentUser() user: AuthenticatedUserDto): Promise<User> {
    const foundUser = await this.usersService.findOne(user.id);
    if (!foundUser) {
      throw new NotFoundException();
    }
    this.logger.debug(`User ${foundUser.id} fetched their profile`);
    return foundUser;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => GraphQLVoid)
  async changePassword(
    @Args('currentPassword') currentPassword: string,
    @Args('newPassword') newPassword: string,
    @CurrentUser() user: AuthenticatedUserDto,
  ) {
    await this.usersService.changePassword(
      user.id,
      currentPassword,
      newPassword,
    );
    return GraphQLVoid;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => GraphQLVoid, { nullable: true })
  async deleteAccount(
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<typeof GraphQLVoid> {
    await this.authService.deleteAccount(user.id);
    await this.authService.signOutAll(user.id);
    return GraphQLVoid;
  }
}
