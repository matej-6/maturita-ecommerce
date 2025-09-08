import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { GraphqlAppContext } from 'src/app.module';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailInput } from './dto/verifyEmail.input';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { MeResponse } from './dto/me.response';
export declare class AuthResolver {
    private readonly authService;
    private readonly usersService;
    private readonly configService;
    private readonly logger;
    constructor(authService: AuthService, usersService: UsersService, configService: ConfigService);
    verifyEmail(verifyEmailInput: VerifyEmailInput): Promise<void>;
    requestEmailVerification(user: AuthenticatedUserDto): Promise<void>;
    logoutAll({ res }: GraphqlAppContext, user: AuthenticatedUserDto): Promise<void>;
    me(user: AuthenticatedUserDto): Promise<MeResponse>;
}
