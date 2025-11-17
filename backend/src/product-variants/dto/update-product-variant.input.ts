import { CreateProductVariantInput } from './create-product-variant.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductVariantInput extends PartialType(CreateProductVariantInput) {
  @Field(() => Int)
  id: number;
}
