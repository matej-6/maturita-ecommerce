import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Logger, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { GraphqlAppContext } from 'src/app.module';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailInput } from './dto/verifyEmail.input';
import { GraphQLVoid } from 'graphql-scalars';
import { CurrentUser } from './current-user.decorator';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { MeResponse } from './dto/me.response';
import { GqlJwtAuthGuard } from './guards/gql-jwt-auth.guard';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  // @Mutation(() => AuthResponse)
  // async login(@Args('authInput') authInput: AuthInput) {
  //   const user = await this.authService.validateUserWithCredentials(
  //     authInput.email,
  //     authInput.password,
  //   );
  //   if (!user) {
  //     throw new BadRequestException('Invalid email or password');
  //   }

  //   return this.authService.login(user);
  // }

  @Mutation(() => GraphQLVoid)
  async verifyEmail(
    @Args('verifyEmailInput') verifyEmailInput: VerifyEmailInput,
  ) {
    await this.authService.validateEmail(
      verifyEmailInput.email,
      verifyEmailInput.code,
    );
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => GraphQLVoid)
  async requestEmailVerification(@CurrentUser() user: AuthenticatedUserDto) {
    await this.authService.sendEmailVerification(user.email);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => GraphQLVoid)
  async logoutAll(
    @Context() { res }: GraphqlAppContext,
    @CurrentUser() user: AuthenticatedUserDto,
  ) {
    await this.authService.signOutAll(user.id);
    res.clearCookie('Authentication');
    res.clearCookie('Refresh');
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => MeResponse, { name: 'me' })
  async me(@CurrentUser() user: AuthenticatedUserDto): Promise<MeResponse> {
    const foundUser = await this.usersService.findOne(user.id);
    if (!foundUser) {
      throw new NotFoundException();
    }
    return MeResponse.fromUser(foundUser);
  }
}
