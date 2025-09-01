import { InputType, Field } from '@nestjs/graphql';
import {
  ArrayMinSize,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateCategoryTranslationInput } from './create-category-translation.input';
import { ContainsEnglishTranslation } from '../validators/contains-english-translation.constraint';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'Slug of the category' })
  @IsString({ message: i18nValidationMessage('validation.required') })
  @MinLength(3, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(255, { message: i18nValidationMessage('validation.maxLength') })
  slug: string;

  @Field(() => String, {
    description: 'Parent category id',
    nullable: true,
  })
  @IsOptional()
  @IsUUID(undefined, { message: i18nValidationMessage('validation.invalid') })
  parentCategoryId?: string;

  @Field(() => [CreateCategoryTranslationInput], {
    description: 'Category translations',
  })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, {
    message: i18nValidationMessage('validation.field.translation.minLength'),
  })
  @ContainsEnglishTranslation({
    message: i18nValidationMessage(
      'validation.field.translation.englishRequired',
    ),
  })
  translations: CreateCategoryTranslationInput[];
}
