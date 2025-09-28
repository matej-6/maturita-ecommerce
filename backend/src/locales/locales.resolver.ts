import { Resolver, Query, Args } from '@nestjs/graphql';
import { LocalesService } from './locales.service';
import { Locale } from './entities/locale.entity';

@Resolver(() => Locale)
export class LocalesResolver {
  constructor(private readonly localesService: LocalesService) {}

  @Query(() => [Locale], { name: 'locales' })
  findAll() {
    return this.localesService.findAll();
  }

  @Query(() => Locale, { name: 'locale' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.localesService.findOne(id);
  }
}
