import { Global, Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoriesService } from 'src/categories/categories.service';

@Global()
@Module({
  imports: [PrismaModule, CategoriesModule],
  providers: [DataloaderService, CategoriesService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
