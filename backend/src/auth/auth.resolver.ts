import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import { AuthResponse } from './dto/auth.response';
import { AuthInput } from './dto/auth.input';
import { UsersService } from 'src/users/users.service';
import { AppContext } from 'src/app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/validate';
import { VerifyEmailInput } from './dto/verifyEmail.input';
import { GraphQLVoid } from 'graphql-scalars';
import { IsEmail } from 'class-validator';

@Resolver()
export class AuthResolver {
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
      sameSite: 'lax',
      httpOnly: true,
      secure:
        this.configService.getOrThrow<Env['NODE_ENV']>('NODE_ENV') ===
        'production',
      expires: refreshTokenExpirationDate,
    });

    return {
      access_token: accessToken,
    };
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
}
