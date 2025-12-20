import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProductVariantAttributeKeyTranslationInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  keyTranslation: string;

  @Field(() => String)
  localeCode: string;
}
