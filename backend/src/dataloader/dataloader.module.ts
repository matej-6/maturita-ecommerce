import { Global, Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoriesService } from 'src/categories/categories.service';
import { LocalesModule } from 'src/locales/locales.module';
import { LocalesService } from 'src/locales/locales.service';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';

@Global()
@Module({
  imports: [PrismaModule, CategoriesModule, LocalesModule, ProductsModule],
  providers: [
    DataloaderService,
    CategoriesService,
    LocalesService,
    ProductsService,
  ],
  exports: [DataloaderService],
})
export class DataloaderModule {}
