import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Category as CategoryEntity } from 'generated/prisma/client';

@ObjectType()
export class Category implements Partial<CategoryEntity> {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  slug: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  parentCategoryId: number | null;

  @Field(() => Boolean, {
    description: 'If true, the category has a valid setup.',
  })
  isSetup: boolean;

  @Field(() => Boolean)
  isPublic: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
