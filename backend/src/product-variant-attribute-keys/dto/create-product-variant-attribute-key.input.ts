import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductVariantAttributeKeyInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
