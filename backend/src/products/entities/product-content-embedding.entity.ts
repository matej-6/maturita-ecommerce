import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  ProductContentEmbeddingTask as DbProductContentEmbedding,
  EmbeddingTaskStatus,
} from 'generated/prisma/client';

@ObjectType()
export class ProductContentEmbedding
  implements Partial<DbProductContentEmbedding>
{
  @Field(() => Int)
  id: number;

  @Field(() => String)
  lang: string;

  @Field(() => Int)
  productId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => EmbeddingTaskStatus)
  status: EmbeddingTaskStatus;
}

registerEnumType(EmbeddingTaskStatus, {
  name: 'EmbeddingTaskStatus',
});
