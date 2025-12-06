import { InputType, Field } from '@nestjs/graphql';
import { IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class CreateProductTranslationInput {
  @Field(() => String, { description: 'Product name' })
  @IsString({ message: i18nValidationMessage('validation.required') })
  @MinLength(3, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(255, { message: i18nValidationMessage('validation.maxLength') })
  name: string;

  @Field(() => String, { description: 'Product description', nullable: true })
  @ValidateIf((obj, value) => ![undefined, null].includes(value))
  @IsString({ message: i18nValidationMessage('validation.required') })
  @MaxLength(4000, { message: i18nValidationMessage('validation.maxLength') })
  description?: string | null;
  @Field(() => String, {
    description: 'Product markdown content',
    nullable: true,
  })
  @ValidateIf((obj, value) => ![undefined, null].includes(value))
  @IsString({ message: i18nValidationMessage('validation.required') })
  @MaxLength(4000, { message: i18nValidationMessage('validation.maxLength') })
  markdownContent?: string | null;

  @Field(() => String, { description: 'Locale code' })
  @IsString({ message: i18nValidationMessage('validation.required') })
  @MinLength(2, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(5, { message: i18nValidationMessage('validation.maxLength') })
  localeCode: string;
}
