import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class CreateLocaleInput {
  @Field(() => String, { description: 'Locale code' })
  @MinLength(2, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(5, { message: i18nValidationMessage('validation.maxLength') })
  code: string;

  @Field(() => String, { description: 'Native locale name' })
  @MinLength(2, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(100, { message: i18nValidationMessage('validation.maxLength') })
  name: string;

  @IsBoolean({ message: i18nValidationMessage('validation.invalid') })
  @Field(() => Boolean, { description: 'Is the locale active?' })
  isActive: boolean;
}
