import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AttributeKey as DbAttributeKey } from 'generated/prisma/client';
import { Paginated } from 'src/lib/pagination';

@ObjectType()
export class ProductVariantAttributeKey implements Partial<DbAttributeKey> {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  key: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class PaginatedProductVariantAttributeKey extends Paginated(
  ProductVariantAttributeKey,
) {}
