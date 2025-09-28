import { ObjectType, Field } from '@nestjs/graphql';
import type { Locale as LocaleType } from 'src/locales';

@ObjectType()
export class Locale implements LocaleType {
  @Field(() => String, { description: 'Locale code' })
  code: string;

  @Field(() => String, { description: 'Native locale name' })
  name: string;
}
