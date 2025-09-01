import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class AuthInput {
  @Field()
  @IsEmail(undefined, { message: i18nValidationMessage('validation.invalid') })
  email: string;

  @Field()
  @IsString({ message: i18nValidationMessage('validation.required') })
  @MinLength(8, { message: i18nValidationMessage('validation.minLength') })
  password: string;
}
