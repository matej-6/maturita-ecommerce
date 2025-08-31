import { ObjectType, Field, ID } from '@nestjs/graphql';
import { type Locale as DbLocale } from '@prisma/client';

@ObjectType()
export class Locale implements Partial<DbLocale> {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Locale code' })
  code: string;

  @Field(() => String, { description: 'Native locale name' })
  name: string;

  @Field(() => Boolean, { description: 'Is the locale active?' })
  isActive: boolean;
}
