import { Field, InputType } from '@nestjs/graphql';
import type { User } from 'generated/prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class UpdateUserInput implements Partial<User> {
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @IsUUID(undefined, { message: i18nValidationMessage('validation.invalid') })
  @Field(() => String)
  id: string;

  @IsString({ message: i18nValidationMessage('validation.required') })
  @MinLength(3, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(128, { message: i18nValidationMessage('validation.maxLength') })
  @Field(() => String)
  firstName: string;

  @IsString({ message: i18nValidationMessage('validation.required') })
  @MinLength(3, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(128, { message: i18nValidationMessage('validation.maxLength') })
  @Field(() => String)
  lastName: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @IsEmail({}, { message: i18nValidationMessage('validation.invalid') })
  @Field(() => String)
  email: string;
}
