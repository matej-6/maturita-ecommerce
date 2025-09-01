import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class CreateUserInput {
  @MinLength(1, { message: i18nValidationMessage('validation.required') })
  @MaxLength(128, { message: i18nValidationMessage('validation.maxLength') })
  @Field(() => String)
  name: string;

  @MinLength(1, { message: i18nValidationMessage('validation.required') })
  @MaxLength(128, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  @Field(() => String)
  lastName: string;

  @IsEmail({}, { message: i18nValidationMessage('validation.invalid') })
  @MaxLength(256, { message: i18nValidationMessage('validation.maxLength') })
  @Field(() => String)
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @MinLength(8, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(512, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  @Field(() => String)
  password: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @MinLength(8, {
    message: i18nValidationMessage('validation.minLength'),
  })
  @MaxLength(512, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  @ValidateIf((o: CreateUserInput) => o.password === o.confirmPassword, {
    message: i18nValidationMessage('validation.field.confirmPassword.match'),
  })
  @Field(() => String)
  confirmPassword: string;
}
