import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'Name of the category' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @Field(() => String, {
    description: 'Description of the category',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @Field(() => String, {
    description: 'Parent category id',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  parentCategoryId?: string;
}
