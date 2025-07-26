import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth.input';
import { UsersService } from 'src/users/users.service';
export declare class AuthResolver {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(authInput: AuthInput): Promise<void>;
}
