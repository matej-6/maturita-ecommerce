import { InputType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class VerifyEmailInput {
  @IsNotEmpty()
  @Field(() => String)
  code: string;

  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;
}
