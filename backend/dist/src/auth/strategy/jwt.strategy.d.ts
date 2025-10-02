import { ConfigService } from '@nestjs/config';
import { Role } from 'generated/prisma/client';
import { Strategy } from 'passport-jwt';
import { Env } from 'src/config/validate';
import { UsersService } from 'src/users/users.service';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly usersService;
    private readonly logger;
    constructor(configService: ConfigService<Env>, usersService: UsersService);
    validate(payload: {
        userId: string;
        role: Role;
        email: string;
    }): AuthenticatedUserDto;
}
export {};
