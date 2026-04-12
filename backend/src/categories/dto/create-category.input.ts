import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'Slug of the category' })
  @IsString({ message: i18nValidationMessage('validation.required') })
  @MinLength(3, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(255, { message: i18nValidationMessage('validation.maxLength') })
  slug: string;

  @Field(() => Int, {
    description: 'Parent category id',
    nullable: true,
  })
  @ValidateIf((obj, value) => ![undefined, null].includes(value))
  @IsInt({ message: i18nValidationMessage('validation.invalid') })
  parentCategoryId?: number;

  @Field(() => Boolean)
  isPublic: boolean;
}
