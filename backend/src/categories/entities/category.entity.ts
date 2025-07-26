import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Category as CategoryEntity } from '@prisma/client';

@ObjectType()
export class Category implements CategoryEntity {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  parentCategoryId: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
