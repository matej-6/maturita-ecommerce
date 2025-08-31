import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LocalesService } from './locales.service';
import { Locale } from './entities/locale.entity';
import { CreateLocaleInput } from './dto/create-locale.input';
import { UpdateLocaleInput } from './dto/update-locale.input';

@Resolver(() => Locale)
export class LocalesResolver {
  constructor(private readonly localesService: LocalesService) {}

  @Mutation(() => Locale)
  createLocale(
    @Args('createLocaleInput') createLocaleInput: CreateLocaleInput,
  ) {
    return this.localesService.create(createLocaleInput);
  }

  @Query(() => [Locale], { name: 'locales' })
  findAll() {
    return this.localesService.findAll();
  }

  @Query(() => Locale, { name: 'locale' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.localesService.findOne(id);
  }

  @Mutation(() => Locale)
  updateLocale(
    @Args('updateLocaleInput') updateLocaleInput: UpdateLocaleInput,
  ) {
    return this.localesService.update(updateLocaleInput.id, updateLocaleInput);
  }

  @Mutation(() => Locale)
  removeLocale(@Args('id', { type: () => String }) id: string) {
    return this.localesService.remove(id);
  }
}
