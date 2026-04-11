import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Cart as DbCart } from 'generated/prisma/client';

@ObjectType()
export class Cart implements Partial<DbCart> {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  userId!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
