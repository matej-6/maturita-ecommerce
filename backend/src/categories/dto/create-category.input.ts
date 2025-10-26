import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'Slug of the category' })
  @IsString({ message: i18nValidationMessage('validation.required') })
  @MinLength(5, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(255, { message: i18nValidationMessage('validation.maxLength') })
  slug: string;

  @Field(() => String, {
    description: 'Parent category id',
    nullable: true,
  })
  @ValidateIf((obj, value) => !['', undefined].includes(value))
  @IsUUID(undefined, { message: i18nValidationMessage('validation.invalid') })
  parentCategoryId?: string;
}
