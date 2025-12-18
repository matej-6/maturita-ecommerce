import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LLMTask as DbLLMTask, LLMTaskStatus } from 'generated/prisma/client';

@ObjectType()
export class LLMTask implements Partial<DbLLMTask> {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  prompt: string;

  @Field(() => String, { nullable: true })
  response: string | null;
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
