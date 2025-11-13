import { IsInt } from 'class-validator';
import { CreateCategoryInput } from './create-category.input';
import { InputType, Field, ID } from '@nestjs/graphql';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class UpdateCategoryInput extends CreateCategoryInput {
  @Field(() => ID)
  @IsInt({ message: i18nValidationMessage('validation.invalid') })
  id: number;
}
