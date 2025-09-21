import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Category as CategoryEntity } from '@prisma/client';
import { CategoryTranslation } from './category-translation.entity';

@ObjectType()
export class Category implements CategoryEntity {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  slug: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  parentCategoryId: string | null;

  @Field(() => [CategoryTranslation], { description: 'Category translations' })
  translations: Array<CategoryTranslation>;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
