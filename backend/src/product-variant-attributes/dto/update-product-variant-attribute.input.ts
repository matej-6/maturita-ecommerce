import { CreateProductVariantAttributeInput } from './create-product-variant-attribute.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductVariantAttributeInput extends PartialType(CreateProductVariantAttributeInput) {
  @Field(() => Int)
  id: number;
}
