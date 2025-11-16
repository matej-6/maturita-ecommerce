import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { type CategoryTranslation as DbCategoryTranslation } from 'generated/prisma/client';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class CreateCategoryTranslationInput
  implements Partial<DbCategoryTranslation>
{
  @Field(() => Int, { description: 'category id' })
  @IsInt({ message: i18nValidationMessage('validation.invalid') })
  categoryId: number;

  @Field(() => String, { description: 'Category name' })
  @MinLength(3, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(255, { message: i18nValidationMessage('validation.maxLength') })
  name: string;

  @Field(() => String, { description: 'Category description', nullable: true })
  @IsOptional()
  @MaxLength(4000, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  description?: string;

  @Field(() => String, { description: 'Locale code' })
  @IsString({ message: i18nValidationMessage('validation.required') })
  @MinLength(2, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(5, { message: i18nValidationMessage('validation.maxLength') })
  localeCode: string;
}
