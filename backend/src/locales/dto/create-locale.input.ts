import { InputType, Field } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateLocaleInput {
  @Field(() => String, { description: 'Locale code' })
  @Length(2, 5, { message: 'Code must be between 2 and 5 characters long.' })
  code: string;

  @Field(() => String, { description: 'Native locale name' })
  @Length(2, 100, {
    message: 'Name must be between 2 and 100 characters long.',
  })
  name: string;

  @Field(() => Boolean, { description: 'Is the locale active?' })
  isActive: boolean;
}
