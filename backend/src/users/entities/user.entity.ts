import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';

import { Role } from 'generated/prisma/client';
import { UserDto } from '../dto/user.dto';

@ObjectType()
export class User implements Partial<UserDto> {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  firstName: string | null;

  @Field(() => String, { nullable: true })
  lastName: string | null;

  @Field(() => Role)
  role: Role;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});
