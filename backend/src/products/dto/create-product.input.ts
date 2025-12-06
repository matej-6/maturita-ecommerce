import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class CreateProductInput {
  @Field(() => String, { description: 'Product slug' })
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
  categoryId?: number;

  @Field(() => Boolean)
  @IsBoolean({ message: i18nValidationMessage('validation.invalid') })
  isPublic: boolean;
}
