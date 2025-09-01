import { IsBoolean, IsUUID, MaxLength, MinLength } from 'class-validator';
import { CreateLocaleInput } from './create-locale.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class UpdateLocaleInput extends PartialType(CreateLocaleInput) {
  @Field(() => ID, { description: 'Locale ID' })
  @IsUUID(undefined, { message: i18nValidationMessage('validation.invalid') })
  id: string;

  @Field(() => String, { description: 'Locale code' })
  @MinLength(2, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(5, { message: i18nValidationMessage('validation.maxLength') })
  code: string;

  @Field(() => String, { description: 'Native locale name' })
  @MinLength(2, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(100, { message: i18nValidationMessage('validation.maxLength') })
  name: string;

  @Field(() => Boolean, { description: 'Is the locale active?' })
  @IsBoolean({ message: i18nValidationMessage('validation.invalid') })
  isActive: boolean;
}
