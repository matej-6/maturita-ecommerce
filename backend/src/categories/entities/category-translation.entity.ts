import { Field, Int, ObjectType } from '@nestjs/graphql';

import { type CategoryTranslation as DbCategoryTranslation } from 'generated/prisma/client';

@ObjectType()
export class CategoryTranslation implements Partial<DbCategoryTranslation> {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Int)
  categoryId!: number;

  @Field(() => String)
  locale!: string;
}
