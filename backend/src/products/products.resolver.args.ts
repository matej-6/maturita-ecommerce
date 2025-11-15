import { ArgsType, Field, ID, Int } from '@nestjs/graphql';

@ArgsType()
export class ProductFindOneQueryArgs {
  @Field(() => ID)
  id: number;

  @Field(() => Boolean, { nullable: true })
  isSetup: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isPublic: boolean | null;
}

@ArgsType()
export class ProductFindAllQueryArgs {
  @Field(() => Boolean, { nullable: true })
  isSetup: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isPublic: boolean | null;

  @Field(() => Int, {
    nullable: true,
    description:
      'null - only products with no category will be returned, 0 - all products will be returned, int >= 1 - only the children of category with given id will be returned',
  })
  categoryId: number | null;
}

@ArgsType()
export class ProductTranslationsQueryArgs {
  @Field(() => [String], {
    defaultValue: [],
    description:
      'empty array - all translations will be returned, [...string] - only the translation matching the locales in array will be returned',
  })
  locales: string[];
}
