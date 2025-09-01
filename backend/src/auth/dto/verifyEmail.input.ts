import { InputType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class VerifyEmailInput {
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @Field(() => String)
  code: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @IsEmail(undefined, { message: i18nValidationMessage('validation.invalid') })
  @Field(() => String)
  email: string;
}
