import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CategoryFindOneQueryFilterInput {
  @Field(() => Boolean, { nullable: true })
  isSetup: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isPublic: boolean | null;
}

@InputType()
export class CategoryFindAllQueryFilterInput extends CategoryFindOneQueryFilterInput {
  @Field(() => String, {
    nullable: true,
    description:
      "null - only categories with no parent category will be returned, '*' - all categories will be returned, 'uuid' - only the children of category with given uuid will be returned",
  })
  parentCategoryId: string | null;
}

@InputType()
export class CategoryTranslationsQueryFilter {
  @Field(() => [String], {
    description:
      'empty array - all translations will be returned, [...string] - only the translation matching the locales in array will be returned',
  })
  locales: string[];
}
