import { Global, Module } from '@nestjs/common';
import { LocalesService } from './locales.service';
import { LocalesResolver } from './locales.resolver';

@Global()
@Module({
  providers: [LocalesResolver, LocalesService],
  exports: [LocalesService],
})
export class LocalesModule {}
