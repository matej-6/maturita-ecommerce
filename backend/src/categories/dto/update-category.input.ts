import { IsUUID } from 'class-validator';
import { CreateCategoryInput } from './create-category.input';
import { InputType, Field, ID, OmitType } from '@nestjs/graphql';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class UpdateCategoryInput extends OmitType(CreateCategoryInput, [
  'translations',
]) {
  @Field(() => ID)
  @IsUUID(undefined, { message: i18nValidationMessage('validation.invalid') })
  id: string;
}
