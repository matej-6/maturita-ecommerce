import { Field, InputType, Int } from '@nestjs/graphql';
import { MaxLength, MinLength, IsInt, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class CreateProductReviewInput {
  @Field(() => Int)
  orderItemId: number;

  @IsInt({
    message: i18nValidationMessage('validation.invalidType', {
      type: 'integer',
    }),
  })
  @Min(1, { message: i18nValidationMessage('validation.min') })
  @Max(5, { message: i18nValidationMessage('validation.max') })
  @Field(() => Int)
  rating: number;
  @MinLength(1, { message: i18nValidationMessage('validation.required') })
  @MaxLength(1000, { message: i18nValidationMessage('validation.maxLength') })
  @Field(() => String, { nullable: true })
  comment: string | null;
  @Field(() => String)
  lang: string;
}
