import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';

import { Role } from 'generated/prisma/client';
import { UserDto } from '../dto/user.dto';
import { Paginated } from 'src/lib/pagination';

@ObjectType()
export class User implements Partial<UserDto> {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  avatarUrl: string | null;
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType()
export class PaginatedUser extends Paginated(User) {}
