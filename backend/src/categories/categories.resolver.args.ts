import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class CategoryFindOneQueryFilterArgs {
  @Field(() => Boolean, { nullable: true })
  isSetup?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isPublic?: boolean | null;
}

@ArgsType()
export class CategoryFindAllQueryFilterArgs extends CategoryFindOneQueryFilterArgs {
  @Field(() => Int, {
    nullable: true,
    description:
      'null - only categories with no parent category will be returned, 0 - all categories will be returned, int >= 1 - only the children of category with given id will be returned',
  })
  parentCategoryId?: number | null;
  @Field(() => String, {
    nullable: true,
    description: 'Filter categories by slug containing this query string',
  })
  slugQuery?: string | null;

  @Field(() => Int, {
    nullable: true,
    description: 'Filter categories by id equal to this value',
  })
  idQuery?: number | null;
}

@ArgsType()
export class CategorySortByArgs {
  @Field(() => String, {
    description: 'Field to sort by',
    nullable: true,
  })
  sortBy?: string | null;

  @Field(() => Boolean, {
    description:
      'If true, sort in ascending order, else descending. If null, default sorting order is used',
    nullable: true,
  })
  ascending?: boolean | null;
}

@ArgsType()
export class CategoryTranslationsQueryFilterArgs {
  @Field(() => [String], {
    description:
      'empty array - all translations will be returned, [...string] - only the translation matching the locales in array will be returned',
  })
  locales?: string[];
}
