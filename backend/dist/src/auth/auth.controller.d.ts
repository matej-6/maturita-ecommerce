import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refreshToken(user: AuthenticatedUserDto): Promise<AuthResponseDto>;
    logout(user: AuthenticatedUserDto, req: Request): Promise<void>;
    logoutAll(user: AuthenticatedUserDto): Promise<void>;
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
}
