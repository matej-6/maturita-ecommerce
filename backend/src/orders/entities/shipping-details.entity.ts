import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OrderShippingDetails as DbOrderShippingDetails } from 'generated/prisma/client';
@ObjectType()
export class OrderShippingDetails implements Partial<DbOrderShippingDetails> {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  city: string | null;

  @Field(() => String)
  line1: string;

  @Field(() => String, { nullable: true })
  line2: string | null;

  @Field(() => String, { nullable: true })
  phone: string | null;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => String)
  country: string;

  @Field(() => String)
  postalCode: string;

  @Field(() => String)
  name: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Int)
  orderId: number;
}
