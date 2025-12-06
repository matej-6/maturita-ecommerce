import { Field, Int, ObjectType } from '@nestjs/graphql';

import { ProductImage as DbProductImage } from 'generated/prisma/client';

@ObjectType({ isAbstract: true })
export abstract class BaseImageClass implements Partial<DbProductImage> {
  @Field(() => Int)
  id: number;
  @Field(() => String)
  base64: string;
  @Field(() => Boolean)
  isThumbnail: boolean;
  @Field(() => String)
  mimeType: string;
}
