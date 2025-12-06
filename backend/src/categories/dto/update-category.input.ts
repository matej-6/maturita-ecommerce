import { IsInt } from 'class-validator';
import { CreateCategoryInput } from './create-category.input';
import { InputType, Field, Int } from '@nestjs/graphql';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class UpdateCategoryInput extends CreateCategoryInput {
  @Field(() => Int, { description: 'Category id' })
  @IsInt({ message: i18nValidationMessage('validation.invalid') })
  id: number;
}
