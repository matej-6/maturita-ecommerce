import {
  Controller,
  FileTypeValidator,
  HttpCode,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  //https://docs.nestjs.com/techniques/file-upload
  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(204)
  async uploadImage(
    @CurrentUser() user: AuthenticatedUserDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        exceptionFactory(error) {
          console.error(error);
          throw new Error(error);
        },
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), //10mb
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    this.logger.log('here...');
    await this.usersService.uploadAvatar(user.id, {
      buffer: file.buffer,
      mimeType: file.mimetype,
    });
  }
}
