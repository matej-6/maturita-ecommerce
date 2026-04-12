import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  LLMTask as DbLLMTask,
  LLMTaskStatus,
  LLMUserPromptResponse as DbLLMUserPromptResponse,
} from 'generated/prisma/client';
import { Product } from 'src/products/entities/product.entity';

@ObjectType()
export class UserPromptResponse implements Partial<DbLLMUserPromptResponse> {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  text: string;

  @Field(() => [Product], { nullable: true })
  products: Product[] | null;
}

@ObjectType()
export class LLMTask implements Partial<DbLLMTask> {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  prompt: string;

  @Field(() => UserPromptResponse, { nullable: true })
  response: UserPromptResponse | null;
  @Field(() => LLMTaskStatus)
  status: LLMTaskStatus;

  @Field(() => Date)
  date: Date;

  @Field(() => Int)
  userId: number;
}

registerEnumType(LLMTaskStatus, {
  name: 'LLMTaskStatus',
});
