import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CategoryFindOneQueryFilterInput {
  @Field(() => Boolean, { nullable: true })
  isSetup: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isPublic: boolean | null;
}

@InputType()
export class CategoryFindAllQueryFilterInput extends CategoryFindOneQueryFilterInput {
  @Field(() => Int, {
    nullable: true,
    description:
      'null - only categories with no parent category will be returned, 0 - all categories will be returned, int >= 1 - only the children of category with given id will be returned',
  })
  parentCategoryId: number | null;
}

@InputType()
export class CategoryTranslationsQueryFilter {
  @Field(() => [String], {
    description:
      'empty array - all translations will be returned, [...string] - only the translation matching the locales in array will be returned',
  })
  locales: string[];
}
