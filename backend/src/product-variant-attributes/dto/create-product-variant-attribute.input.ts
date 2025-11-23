import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductVariantAttributeInput {
  @Field(() => Int, { description: 'Attribute Key ID' })
  keyId: number;

  @Field(() => String, { description: 'Attribute Value' })
  value: string;
}
