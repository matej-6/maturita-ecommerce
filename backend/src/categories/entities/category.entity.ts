import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category as CategoryEntity } from 'generated/prisma/client';
import { Paginated } from 'src/lib/pagination';

@ObjectType()
export class Category implements Partial<CategoryEntity> {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  slug!: string;

  @Field(() => Int, { nullable: true })
  parentCategoryId!: number | null;

  @Field(() => Boolean, {
    description: 'If true, the category has a valid setup.',
  })
  isSetup!: boolean;

  @Field(() => Boolean)
  isPublic!: boolean;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
export class PaginatedCategory extends Paginated(Category) {}
