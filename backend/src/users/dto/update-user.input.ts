import { Field, InputType } from '@nestjs/graphql';
import type { User } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class UpdateUserInput implements Partial<User> {
  @IsNotEmpty()
  @IsUUID()
  @Field(() => String)
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(128)
  @Field(() => String)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(128)
  @Field(() => String)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;
}
