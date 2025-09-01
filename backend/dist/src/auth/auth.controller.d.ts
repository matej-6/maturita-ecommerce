import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, res: Response): Promise<void>;
    refreshToken(user: AuthenticatedUserDto, res: Response): Promise<void>;
    logout(user: AuthenticatedUserDto, req: Request, res: Response): Promise<void>;
    logoutAll(user: AuthenticatedUserDto, req: Request, res: Response): Promise<void>;
    register(registerDto: RegisterDto, res: Response): Promise<void>;
}
