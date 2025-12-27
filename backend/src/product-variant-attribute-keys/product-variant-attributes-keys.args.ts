import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';

@ArgsType()
export class AttributeKeyFindAllQueryArgs {
  @Field(() => Int, { nullable: true })
  id: number | null;

  @Field(() => String, { nullable: true })
  key: string | null;
}

export enum AttributeKeySortingField {
  ID = 'id',
  KEY = 'key',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

registerEnumType(AttributeKeySortingField, {
  name: 'AttributeKeySortingField',
});

@ArgsType()
export class AttributeKeySortingArgs {
  @Field(() => AttributeKeySortingField, { nullable: true })
  sortBy: AttributeKeySortingField | null;

  @Field(() => Boolean, { nullable: true })
  ascending: boolean | null;
}
