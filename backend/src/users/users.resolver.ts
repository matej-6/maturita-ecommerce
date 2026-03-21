import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { PaginatedUser, User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { GraphQLVoid } from 'graphql-scalars';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { Order } from 'src/orders/entities/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { PaginationArgs } from 'src/lib/pagination.args';
import { UserFindAllQueryArgs, UserSortingArgs } from './user.resolver.args';
import { UpdatePasswordInput } from './dto/update-password.input';
import { Role } from 'generated/prisma/enums';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  @UseGuards(AdminGuard)
  @Query(() => PaginatedUser, { name: 'findAllPaginatedUsers' })
  async findAllPaginated(
    @Args() paginationArgs: PaginationArgs,
    @Args() findAllQueryArgs: UserFindAllQueryArgs,
    @Args() sortByArgs: UserSortingArgs,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<PaginatedUser> {
    return await this.usersService.findAllPaginated(
      paginationArgs,
      findAllQueryArgs,
      sortByArgs,
      user,
    );
  }

  @UseGuards(AdminGuard)
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<User> {
    return this.usersService.update(user.id, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => GraphQLVoid)
  async deleteAvatar(
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<typeof GraphQLVoid> {
    await this.usersService.deleteAvatar(user.id);
    return GraphQLVoid;
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => [Order], { name: 'orders' })
  async getOrdersForUser(@Parent() user: User): Promise<Order[]> {
    return this.ordersService.findAllOrdersByUserId(user.id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => GraphQLVoid)
  async updatePassword(
    @Args('input') input: UpdatePasswordInput,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<typeof GraphQLVoid> {
    await this.usersService.changePassword(
      user.id,
      input.currentPassword,
      input.newPassword,
    );
    return GraphQLVoid;
  }

  @UseGuards(AdminGuard)
  @Mutation(() => GraphQLVoid, { name: 'updateUserRole' })
  async updateUserRole(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('newRole', { type: () => Role }) newRole: Role,
  ): Promise<typeof GraphQLVoid> {
    await this.usersService.updateUserRole(userId, newRole);
    return GraphQLVoid;
  }
}
