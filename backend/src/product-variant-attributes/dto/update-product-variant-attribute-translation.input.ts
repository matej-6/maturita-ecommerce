import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProductVariantAttributeTranslationInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  valueTranslation: string;

  @Field(() => String)
  locale: string;
}
