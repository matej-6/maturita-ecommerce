import { Field, ID, ObjectType } from '@nestjs/graphql';

import { type CategoryTranslation as DbCategoryTranslation } from 'generated/prisma/client';
import { Locale } from 'src/locales/entities/locale.entity';

@ObjectType()
export class CategoryTranslation implements Partial<DbCategoryTranslation> {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => ID)
  localeId: string;

  @Field(() => ID)
  categoryId: string;

  @Field(() => String)
  locale: string;

  @Field(() => Boolean)
  isActive: boolean;
}
