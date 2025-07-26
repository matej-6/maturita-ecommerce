import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthMiddleware implements NestMiddleware {
    private readonly authService;
    constructor(authService: AuthService);
    use(req: Request, res: Response, next: () => void): void;
}
