import { IsUUID } from 'class-validator';
import { CreateCategoryInput } from './create-category.input';
import { InputType, Field, ID, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput extends OmitType(CreateCategoryInput, [
  'translations',
]) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
