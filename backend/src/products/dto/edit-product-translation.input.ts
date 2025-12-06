import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CreateProductTranslationInput } from './create-product-translation.input';

@InputType()
export class EditProductTranslationInput extends CreateProductTranslationInput {
  @Field(() => Int, { description: 'product translation id' })
  @IsInt({ message: i18nValidationMessage('validation.invalid') })
  productTranslationId: number;
}
