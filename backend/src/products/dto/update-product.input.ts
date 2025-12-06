import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends CreateProductInput {
  @Field(() => Int)
  id: number;
}
