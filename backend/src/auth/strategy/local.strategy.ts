import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import z from 'zod';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<AuthenticatedUserDto> {
    // validate email
    const parsedEmail = z.email().safeParse(email);

    if (!parsedEmail.success) {
      throw new UnauthorizedException('Invalid email');
    }

    const user = await this.authService.validateUserWithCredentials(
      parsedEmail.data,
      password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      role: user.role,
      email: user.email,
    };
  }
}
