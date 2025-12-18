import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateLLMTaskInput {
  @Field(() => String)
  prompt: string;

  @Field(() => Int, { nullable: true })
  productId?: number;
}
