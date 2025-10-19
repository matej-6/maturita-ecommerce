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
import { ContainsTranslation } from '../validators/contains-translation-constraint';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';

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
  @ArrayMinSize(1, {
    message: i18nValidationMessage('validation.field.translation.minLength'),
  })
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryTranslationInput)
  @ContainsTranslation('en', {
    message: i18nValidationMessage(
      'validation.field.translation.englishRequired',
    ),
  })
  translations: CreateCategoryTranslationInput[];
}
