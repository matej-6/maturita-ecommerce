import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProductVariantAttributeInput {
  @Field(() => Int)
  id: number;

  @Field(() => String, { description: 'Attribute Value' })
  value: string;
}
