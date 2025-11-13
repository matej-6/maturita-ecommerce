import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { LocalesModule } from 'src/locales/locales.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocalesService } from 'src/locales/locales.service';

@Module({
  imports: [LocalesModule],
  providers: [ProductsResolver, ProductsService, PrismaService, LocalesService],
})
export class ProductsModule {}
