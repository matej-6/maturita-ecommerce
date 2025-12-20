import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductVariantAttributeKeyTranslationInput {
  @Field(() => Int)
  keyId: number;

  @Field(() => String)
  keyTranslation: string;

  @Field(() => String)
  localeCode: string;
}
