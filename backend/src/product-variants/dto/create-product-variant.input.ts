import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductVariantInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
