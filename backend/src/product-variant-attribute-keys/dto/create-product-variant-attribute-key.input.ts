import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductVariantAttributeKeyInput {
  @Field(() => String)
  key: string;
}
