import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AttributeKeyTranslation as DbAttributeKeyTranslation } from 'generated/prisma/client';

@ObjectType()
export class ProductVariantAttributeKeyTranslation
  implements Partial<DbAttributeKeyTranslation>
{
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  attributeKeyId: number;

  @Field(() => String)
  keyTranslation: string;

  @Field(() => String)
  locale: string;
}
