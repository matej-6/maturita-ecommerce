import {
  Controller,
  FileTypeValidator,
  HttpCode,
  Logger,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductVariantsService } from './product-variants.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('product-variants')
export class ProductVariantsController {
  private readonly logger = new Logger(ProductVariantsController.name);

  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  //https://docs.nestjs.com/techniques/file-upload
  @Post('upload-image/:productId')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(204)
  async uploadImage(
    @Param('productId') productId: number,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), //10mb
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    await this.productVariantsService.addImage(productId, {
      buffer: file.buffer,
      mimeType: file.mimetype,
    });
  }
}
