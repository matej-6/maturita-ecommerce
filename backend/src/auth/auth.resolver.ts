import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { BadRequestException, Logger, UseGuards } from '@nestjs/common';
import { AuthResponse } from './dto/auth.response';
import { AuthInput } from './dto/auth.input';
import { UsersService } from 'src/users/users.service';
import { AppContext } from 'src/app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/validate';
import { VerifyEmailInput } from './dto/verifyEmail.input';
import { GraphQLVoid } from 'graphql-scalars';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';

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
    @Context() { res }: AppContext,
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
    @Context() { res }: AppContext,
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

  @Mutation(() => GraphQLVoid)
  async requestEmailVerification(
    @Args({ name: 'email', type: () => String }) email: string,
  ) {
    await this.authService.sendEmailVerification(email);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => GraphQLVoid)
  async logout(@Context() { res, req }: AppContext) {
    let refreshToken: string;
    try {
      refreshToken = req.cookies?.Refresh as string;
      if (refreshToken) {
        await this.authService.signOut(refreshToken);
      }
    } catch (error) {
      this.logger.debug('No refresh token found for logout: ', error);
    }
    res.clearCookie('Authentication');
    res.clearCookie('Refresh');
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => GraphQLVoid)
  async logoutAll(
    @Context() { res }: AppContext,
    @CurrentUser() user: UserDto,
  ) {
    await this.authService.signOutAll(user.id);
    res.clearCookie('Authentication');
    res.clearCookie('Refresh');
  }
}
