import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { Request, Response } from 'express';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @I18n() i18n: I18nContext,
    @Body() loginDto: LoginDto,
  ): Promise<AuthResponseDto> {
    const user = await this.authService.validateUserWithCredentials(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      console.warn('Invalid email or password login attempt.');
      throw new UnauthorizedException('INVALID_EMAIL_OR_PASSWORD');
    }

    return await this.authService.login({
      id: user.id,
      role: user.role,
      email: user.email,
    });
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: AuthenticatedUserDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.login({
      id: user.id,
      role: user.role,
      email: user.email,
    });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: AuthenticatedUserDto,
    @Req() req: Request,
  ): Promise<void> {
    const refreshToken =
      typeof req.cookies.Refresh === 'string'
        ? req.cookies.Refresh
        : req.headers['x-refresh-token'];

    if (typeof refreshToken === 'string') {
      await this.authService.signOut(refreshToken, user.id);
    }
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(@CurrentUser() user: AuthenticatedUserDto): Promise<void> {
    await this.authService.signOutAll(user.id);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.authService.register(registerDto);
    return await this.authService.login({
      id: user.id,
      role: user.role,
      email: user.email,
    });
  }
}
