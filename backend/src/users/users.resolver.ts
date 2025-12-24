import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { PaginatedUser, User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserAvatar } from './entities/user-avatar.entity';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { GraphQLVoid } from 'graphql-scalars';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { Order } from 'src/orders/entities/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { PaginationArgs } from 'src/lib/pagination.args';
import { UserFindAllQueryArgs, UserSortingArgs } from './user.resolver.args';

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

  @UseGuards(AdminGuard)
  @Mutation(() => User)
  removeUser(@Args('id', { type: () => ID }) id: number) {
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @ResolveField(() => UserAvatar, { name: 'avatar', nullable: true })
  async getAvatar(@Parent() user: User): Promise<UserAvatar | null> {
    return this.usersService.getAvatar(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<User> {
    return this.usersService.update(user.id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => GraphQLVoid)
  async uploadAvatar(
    @Args('base64') base64: string,
    @Args('mimeType') mimeType: string,
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<void> {
    await this.usersService.uploadAvatar(user.id, base64, mimeType);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => GraphQLVoid)
  async deleteAvatar(@CurrentUser() user: AuthenticatedUserDto): Promise<void> {
    await this.usersService.deleteAvatar(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ResolveField(() => [Order], { name: 'orders' })
  async getOrdersForUser(@Parent() user: User): Promise<Order[]> {
    return this.ordersService.findAllOrdersByUserId(user.id);
  }
}
