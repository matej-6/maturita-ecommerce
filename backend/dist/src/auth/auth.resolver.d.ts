import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { AuthInput } from './dto/auth.input';
import { UsersService } from 'src/users/users.service';
import { GraphqlAppContext } from 'src/app.module';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailInput } from './dto/verifyEmail.input';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { MeResponse } from './dto/me.response';
export declare class AuthResolver {
    private readonly authService;
    private readonly usersService;
    private readonly configService;
    private readonly logger;
    constructor(authService: AuthService, usersService: UsersService, configService: ConfigService);
    refreshToken({ res }: GraphqlAppContext, user: UserDto): Promise<void>;
    login(authInput: AuthInput, { res }: GraphqlAppContext): Promise<AuthResponse>;
    verifyEmail(verifyEmailInput: VerifyEmailInput): Promise<void>;
    requestEmailVerification(user: AuthenticatedUserDto): Promise<void>;
    logoutAll({ res }: GraphqlAppContext, user: AuthenticatedUserDto): Promise<void>;
    me(user: AuthenticatedUserDto): Promise<MeResponse>;
}
