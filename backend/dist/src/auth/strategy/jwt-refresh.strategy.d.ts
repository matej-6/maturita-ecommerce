import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { Env } from 'src/config/validate';
import { AuthService } from '../auth.service';
declare const JwtRefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private readonly configService;
    private readonly authService;
    constructor(configService: ConfigService<Env>, authService: AuthService);
    validate(req: Request, payload: {
        userId: string;
    }): Promise<import("../../users/dto/user.dto").UserDto>;
}
export {};
