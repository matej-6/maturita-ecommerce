import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductVariantAttributeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
