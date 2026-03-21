import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { Request, Response } from 'express';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth.response.dto';
import { ERROR } from 'src/errors';
import { SESSION_COOKIE_NAME } from 'src/constants';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const user = await this.authService.validateUserWithCredentials(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      this.logger.warn(`Invalid login attempt for email: ${loginDto.email}`);
      throw new UnauthorizedException(ERROR.invalidEmailOrPassword);
    }

    const authResponse = await this.authService.login(user.id);
    this.authService.setAuthCookies(
      res,
      authResponse.sessionId,
      authResponse.expiresAt,
    );
    return authResponse;
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @CurrentUser() user: AuthenticatedUserDto,
    @Req() req: Request,
  ): Promise<void> {
    const sessionCookie = req.cookies[SESSION_COOKIE_NAME] as
      | string
      | undefined;
    if (sessionCookie) {
      await this.authService.signOut(sessionCookie);
      return;
    }
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const sessionId = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null;
      if (sessionId) {
        await this.authService.signOut(sessionId);
        return;
      }
    }
  }

  @Post('logout-all')
  @UseGuards(AuthGuard)
  async logoutAll(@CurrentUser() user: AuthenticatedUserDto): Promise<void> {
    await this.authService.signOutAll(user.id);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const user = await this.authService.register(registerDto);
    const authResponse = await this.authService.login(user.id);
    this.authService.setAuthCookies(
      res,
      authResponse.sessionId,
      authResponse.expiresAt,
    );
    return authResponse;
  }
}
