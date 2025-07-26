import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(128, { message: 'Name must be less than 128 characters long' })
  @Field(() => String)
  name: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(3, { message: 'Last name must be at least 3 characters long' })
  @MaxLength(128, {
    message: 'Last name must be less than 128 characters long',
  })
  @Field(() => String)
  lastName: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @Field(() => String)
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(256, {
    message: 'Password must be less than 256 characters long',
  })
  @Field(() => String)
  password: string;
}
