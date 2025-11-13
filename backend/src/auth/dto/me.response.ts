import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from 'generated/prisma/client';
import { UserDto } from 'src/users/dto/user.dto';

@ObjectType()
export class MeResponse implements UserDto {
  static fromUser(user: UserDto) {
    const meResponse = new MeResponse();
    meResponse.id = user.id;
    meResponse.email = user.email;
    meResponse.emailVerified = user.emailVerified;
    meResponse.firstName = user.firstName;
    meResponse.lastName = user.lastName;
    meResponse.role = user.role;
    meResponse.avatar = user.avatar;
    meResponse.createdAt = user.createdAt;
    meResponse.updatedAt = user.updatedAt;
    return meResponse;
  }

  @Field(() => ID)
  id: number;

  @Field(() => String)
  email: string;

  @Field(() => Boolean)
  emailVerified: boolean;

  @Field(() => String, { nullable: true })
  firstName: string | null;

  @Field(() => String, { nullable: true })
  lastName: string | null;

  @Field(() => Role)
  role: Role;

  @Field(() => String, { nullable: true })
  avatar: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});
