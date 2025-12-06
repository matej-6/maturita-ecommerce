import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product as DbProduct } from 'generated/prisma/client';
import { Paginated } from 'src/lib/pagination';

@ObjectType()
export class Product implements Partial<DbProduct> {
  @Field(() => Int, { description: 'Product ID' })
  id: number;

  @Field(() => String, { description: 'Product slug' })
  slug: string;

  @Field(() => Int, { nullable: true })
  categoryId?: number | null;

  @Field(() => Boolean)
  isPublic: boolean;

  @Field(() => Boolean)
  isSetup: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class PaginatedProduct extends Paginated(Product) {}
