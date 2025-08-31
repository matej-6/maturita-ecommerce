import { Module } from '@nestjs/common';
import { LocalesService } from './locales.service';
import { LocalesResolver } from './locales.resolver';

@Module({
  providers: [LocalesResolver, LocalesService],
})
export class LocalesModule {}
