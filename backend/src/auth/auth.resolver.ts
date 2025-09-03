import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  BadRequestException,
  Logger,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AuthResponse } from './dto/auth.response';
import { AuthInput } from './dto/auth.input';
import { UsersService } from 'src/users/users.service';
import { GraphqlAppContext } from 'src/app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/validate';
import { VerifyEmailInput } from './dto/verifyEmail.input';
import { GraphQLVoid } from 'graphql-scalars';
import { CurrentUser } from './current-user.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
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

  @UseGuards(JwtRefreshAuthGuard)
  @Mutation(() => GraphQLVoid)
  async refreshToken(
    @Context() { res }: GraphqlAppContext,
    @CurrentUser() user: UserDto,
  ) {
    const {
      accessToken,
      refreshToken,
      accessTokenExpirationDate,
      refreshTokenExpirationDate,
    } = await this.authService.login(user);

    this.authService.setAuthCookies(
      res,
      { token: accessToken, expires: accessTokenExpirationDate },
      { token: refreshToken, expires: refreshTokenExpirationDate },
    );
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('authInput') authInput: AuthInput,
    @Context() { res }: GraphqlAppContext,
  ): Promise<AuthResponse> {
    const user = await this.authService.validateUserWithCredentials(
      authInput.email,
      authInput.password,
    );

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const {
      accessToken,
      refreshToken,
      accessTokenExpirationDate,
      refreshTokenExpirationDate,
    } = await this.authService.login(user);

    res.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure:
        this.configService.getOrThrow<Env['NODE_ENV']>('NODE_ENV') ===
        'production',
      expires: accessTokenExpirationDate,
    });

    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure:
        this.configService.getOrThrow<Env['NODE_ENV']>('NODE_ENV') ===
        'production',
      expires: refreshTokenExpirationDate,
    });

    return user;
  }

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
