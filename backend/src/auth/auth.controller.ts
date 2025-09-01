import {
  Body,
  Controller,
  HttpStatus,
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
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUserWithCredentials(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const {
      accessToken,
      refreshToken,
      accessTokenExpirationDate,
      refreshTokenExpirationDate,
    } = await this.authService.login({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    this.authService.setAuthCookies(
      res,
      {
        token: accessToken,
        expires: accessTokenExpirationDate,
      },
      {
        token: refreshToken,
        expires: refreshTokenExpirationDate,
      },
    );
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: AuthenticatedUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const {
      accessToken,
      accessTokenExpirationDate,
      refreshToken,
      refreshTokenExpirationDate,
    } = await this.authService.login({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    this.authService.setAuthCookies(
      res,
      { token: accessToken, expires: accessTokenExpirationDate },
      { token: refreshToken, expires: refreshTokenExpirationDate },
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: AuthenticatedUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = (req.cookies as Record<string, string> | undefined)
      ?.Refresh;

    if (refreshToken) {
      res.clearCookie('Refresh');
      res.clearCookie('Authentication');
      await this.authService.signOut(refreshToken, user.id);
    }
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(
    @CurrentUser() user: AuthenticatedUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('Refresh');
    res.clearCookie('Authentication');
    await this.authService.signOutAll(user.id);

    res.status(HttpStatus.OK).send();
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(registerDto);
    const {
      accessToken,
      accessTokenExpirationDate,
      refreshToken,
      refreshTokenExpirationDate,
    } = await this.authService.login({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    this.authService.setAuthCookies(
      res,
      { token: accessToken, expires: accessTokenExpirationDate },
      { token: refreshToken, expires: refreshTokenExpirationDate },
    );
  }
}
