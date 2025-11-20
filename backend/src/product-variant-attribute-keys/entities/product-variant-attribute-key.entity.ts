import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AttributeKey as DbAttributeKey } from 'generated/prisma/client';

@ObjectType()
export class ProductVariantAttributeKey implements Partial<DbAttributeKey> {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  key: string;
}
