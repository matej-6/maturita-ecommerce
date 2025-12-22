import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserAvatar as DbUserAvatar } from 'generated/prisma/client';

@ObjectType()
export class UserAvatar implements Partial<DbUserAvatar> {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => String)
  base64: string;

  @Field(() => String)
  mimeType: string;
}
