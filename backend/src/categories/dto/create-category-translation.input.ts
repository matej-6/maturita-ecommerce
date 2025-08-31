import { Field, InputType } from '@nestjs/graphql';
import { type CategoryTranslation as DbCategoryTranslation } from '@prisma/client';
import { IsString, Length, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateCategoryTranslationInput
  implements Partial<DbCategoryTranslation>
{
  @Field(() => String, { description: 'Category name' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(255, { message: 'Name must be at most 255 characters long' })
  name: string;

  @Field(() => String, { description: 'Category description', nullable: true })
  @MaxLength(4000, {
    message: 'Description must be at most 4000 characters long',
  })
  description?: string | null;

  @Field(() => String, { description: 'Locale code' })
  @IsString({ message: 'Locale code must be a string' })
  @Length(2, 5, { message: 'Locale code must be between 2 and 5 characters' })
  localeCode: string;
}
