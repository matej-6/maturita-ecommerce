import { Field, ObjectType } from '@nestjs/graphql';
import { AttributeTranslation as DbAttributeTranslation } from 'generated/prisma/client';

@ObjectType()
export class ProductVariantAttributeTranslation
  implements Partial<DbAttributeTranslation>
{
  @Field(() => Number)
  id: number;

  @Field(() => Number)
  attributeId: number;

  @Field(() => String)
  value: string;

  @Field(() => String)
  locale: string;
}
