import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Env } from 'src/config/validate';
import { UsersService } from 'src/users/users.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly usersService;
    constructor(configService: ConfigService<Env>, usersService: UsersService);
    validate(payload: {
        userId: string;
    }): Promise<import("../../users/dto/user.dto").UserDto | null>;
}
export {};
