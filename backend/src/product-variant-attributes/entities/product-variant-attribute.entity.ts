import { Field, ObjectType } from '@nestjs/graphql';

import { Attribute as DbAttribute } from 'generated/prisma/client';

@ObjectType()
export class ProductVariantAttribute implements Partial<DbAttribute> {
  @Field(() => Number)
  id: number;

  @Field(() => Number)
  attributeKeyId: number;

  @Field(() => Number, { nullable: true })
  productVariantId: number | null;
}
