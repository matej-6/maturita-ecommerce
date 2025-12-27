import { registerEnumType } from '@nestjs/graphql';
import { EmbeddingTaskStatus } from 'generated/prisma/enums';

registerEnumType(EmbeddingTaskStatus, {
  name: 'EmbeddingTaskStatus',
});
