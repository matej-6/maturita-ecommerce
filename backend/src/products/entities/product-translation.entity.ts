import { Field, Int, ObjectType } from '@nestjs/graphql';

import { type ProductTranslation as DbProductTranslation } from 'generated/prisma/client';

@ObjectType()
export class ProductTranslation implements Partial<DbProductTranslation> {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Int)
  productId: number;

  @Field(() => String)
  locale: string;

  @Field(() => String, { nullable: true })
  markdownContent?: string | null;
}
