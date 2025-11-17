import { Field, ObjectType } from '@nestjs/graphql';
import { AttributeKey as DbAttributeKey } from 'generated/prisma/client';

@ObjectType()
export class AttributeKey implements Partial<DbAttributeKey> {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  key: string;
}
