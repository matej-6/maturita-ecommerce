import { InputType, Int, Field } from '@nestjs/graphql';
import { ProductVariant } from '../entities/product-variant.entity';
import {
  IsBoolean,
  IsInt,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class CreateProductVariantInput implements Partial<ProductVariant> {
  @Field(() => String, { description: 'Stock keeping unit' })
  @IsString({ message: i18nValidationMessage('validation.required') })
  @MinLength(3, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(255, { message: i18nValidationMessage('validation.maxLength') })
  sku: string;

  @Field(() => Int)
  @IsInt({ message: i18nValidationMessage('validation.invalid') })
  @IsPositive({ message: i18nValidationMessage('validation.invalid') })
  priceInCents: number;

  @Field(() => Boolean)
  @IsBoolean({ message: i18nValidationMessage('validation.invalid') })
  isPublic: boolean;

  @Field(() => Int)
  @IsInt({ message: i18nValidationMessage('validation.invalid') })
  stock: number;

  @Field(() => [Int], { description: 'List of Product Variant Attribute IDs' })
  @IsInt({ each: true, message: i18nValidationMessage('validation.invalid') })
  attributes: number[];

  @Field(() => Int)
  @IsInt({ message: i18nValidationMessage('validation.invalid') })
  productId: number;
}
