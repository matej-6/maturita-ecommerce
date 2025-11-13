import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Product as DbProduct } from 'generated/prisma/client';

@ObjectType()
export class Product implements Partial<DbProduct> {
  @Field(() => ID, { description: 'Product ID' })
  id: number;

  @Field(() => String, { description: 'Product slug' })
  slug: string;

  @Field(() => Int, { nullable: true })
  categoryId?: number | null;

  @Field(() => Boolean)
  isPublic: boolean;
}
