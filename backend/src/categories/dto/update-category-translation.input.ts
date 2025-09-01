import { Field, InputType } from '@nestjs/graphql';
import { type CategoryTranslation as DbCategoryTranslation } from '@prisma/client';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class UpdateCategoryTranslationInput
  implements Partial<DbCategoryTranslation>
{
  @Field(() => String, { description: 'Category name' })
  @MinLength(3, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(255, { message: i18nValidationMessage('validation.maxLength') })
  name: string;

  @Field(() => String, { description: 'Category description', nullable: true })
  @IsOptional()
  @MaxLength(4000, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  description?: string | null;

  @Field(() => String, { description: 'Locale code' })
  @IsString({ message: i18nValidationMessage('validation.required') })
  @MinLength(2, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(5, { message: i18nValidationMessage('validation.maxLength') })
  localeCode: string;
}
