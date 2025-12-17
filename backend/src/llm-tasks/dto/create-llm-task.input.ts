import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateLLMTaskInput {
  prompt: string;
}
