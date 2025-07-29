import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { AuthInput } from './dto/auth.input';
import { UsersService } from 'src/users/users.service';
import { AppContext } from 'src/app.module';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailInput } from './dto/verifyEmail.input';
import { UserDto } from 'src/users/dto/user.dto';
export declare class AuthResolver {
    private readonly authService;
    private readonly usersService;
    private readonly configService;
    private readonly logger;
    constructor(authService: AuthService, usersService: UsersService, configService: ConfigService);
    refreshToken({ res }: AppContext, user: UserDto): Promise<void>;
    login(authInput: AuthInput, { res }: AppContext): Promise<AuthResponse>;
    verifyEmail(verifyEmailInput: VerifyEmailInput): Promise<void>;
    requestEmailVerification(email: string): Promise<void>;
    logout({ res, req }: AppContext): Promise<void>;
    logoutAll({ res }: AppContext, user: UserDto): Promise<void>;
}
