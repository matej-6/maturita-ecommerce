import { Field, InputType } from '@nestjs/graphql';
import type { User } from 'generated/prisma/client';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class UpdateUserInput implements Partial<User> {
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
}
