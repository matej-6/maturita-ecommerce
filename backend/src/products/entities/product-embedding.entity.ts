import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  EmbeddingTask as DbProductEmbedding,
  EmbeddingTaskType,
  LLMTaskStatus,
} from 'generated/prisma/client';

@ObjectType()
export class ProductEmbedding implements Partial<DbProductEmbedding> {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  lang: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Int)
  productId: number;

  @Field(() => LLMTaskStatus)
  status: LLMTaskStatus;

  @Field(() => EmbeddingTaskType)
  type: EmbeddingTaskType;
}

registerEnumType(LLMTaskStatus, {
  name: 'LLMTaskStatus',
});

registerEnumType(EmbeddingTaskType, {
  name: 'EmbeddingTaskType',
});
