import { CreateProductVariantAttributeKeyInput } from './create-product-variant-attribute-key.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductVariantAttributeKeyInput extends PartialType(CreateProductVariantAttributeKeyInput) {
  @Field(() => Int)
  id: number;
}
