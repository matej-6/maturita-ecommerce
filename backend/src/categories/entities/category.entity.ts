import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Category as CategoryEntity } from 'generated/prisma/client';
import { CategoryTranslation } from './category-translation.entity';

@ObjectType()
export class Category implements Partial<CategoryEntity> {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  slug: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  parentCategoryId: string;

  @Field(() => Boolean, {
    description: 'If true, the category has a valid setup.',
  })
  isSetup: boolean;

  @Field(() => [CategoryTranslation], {
    description: 'Category translations',
    nullable: true,
  })
  translations: CategoryTranslation[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
