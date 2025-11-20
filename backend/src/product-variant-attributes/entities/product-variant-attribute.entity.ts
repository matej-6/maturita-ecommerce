import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Attribute as DbAttribute } from 'generated/prisma/client';

@ObjectType()
export class ProductVariantAttribute implements Partial<DbAttribute> {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  attributeKeyId: number;

  @Field(() => Int, { nullable: true })
  productVariantId: number | null;

  @Field(() => String)
  value: string;
}
