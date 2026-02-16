import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ImageStorageService {
  constructor() {}

  private readonly imageStoragePath = path.join(
    process.cwd(),
    'public',
    'images',
  );

  private readonly baseImageUrl = '/public/images';

  getImageUrl(fileName: string) {
    const safeFileName = path.basename(fileName);
    return `${this.baseImageUrl}/${safeFileName}`;
  }

  getImageFileName(file: { mimeType: string }): string {
    const extension = '.' + file.mimeType.split('/')[1];
    return `${Date.now()}-${randomUUID()}${extension}`;
  }

  async saveImageFile(fileName: string, imageBuffer: Buffer) {
    const filePath = path.join(this.imageStoragePath, fileName);
    if (!fs.existsSync(this.imageStoragePath)) {
      await fs.promises.mkdir(this.imageStoragePath, { recursive: true });
    }
    await fs.promises.writeFile(filePath, imageBuffer);
  }

  async deleteImage(fileName: string) {
    const safeFileName = path.basename(fileName);
    const filePath = path.join(this.imageStoragePath, safeFileName);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}
