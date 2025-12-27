import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  EmbeddingTask as DbProductEmbedding,
  EmbeddingTaskStatus,
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

  @Field(() => EmbeddingTaskStatus)
  status: EmbeddingTaskStatus;
}
