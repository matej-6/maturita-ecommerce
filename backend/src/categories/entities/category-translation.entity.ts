import { Field, ID, ObjectType } from '@nestjs/graphql';

import { type CategoryTranslation as DbCategoryTranslation } from 'generated/prisma/client';

@ObjectType()
export class CategoryTranslation implements Partial<DbCategoryTranslation> {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => ID)
  categoryId: number;

  @Field(() => String)
  locale: string;

  @Field(() => Boolean)
  isActive: boolean;
}
