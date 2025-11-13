import { Field, InputType, Int } from '@nestjs/graphql';
import type { User } from 'generated/prisma/client';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class UpdateUserInput implements Partial<User> {
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @IsInt({ message: i18nValidationMessage('validation.invalid') })
  @Field(() => Int)
  id: number;

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
