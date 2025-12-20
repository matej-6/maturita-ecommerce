import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductVariantAttributeTranslationInput {
  @Field(() => Int)
  attributeId: number;

  @Field(() => String)
  valueTranslation: string;

  @Field(() => String)
  locale: string;
}
