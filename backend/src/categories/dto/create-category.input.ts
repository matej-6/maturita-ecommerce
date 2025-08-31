import { InputType, Field } from '@nestjs/graphql';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateCategoryTranslationInput } from './create-category-translation.input';
import { ContainsEnglishTranslation } from '../validators/contains-english-translation.constraint';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'Slug of the category' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  slug: string;

  @Field(() => String, {
    description: 'Parent category id',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  parentCategoryId?: string;

  @Field(() => [CreateCategoryTranslationInput], {
    description: 'Category translations',
  })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'At least one translation is required' })
  @ContainsEnglishTranslation()
  translations: CreateCategoryTranslationInput[];
}
