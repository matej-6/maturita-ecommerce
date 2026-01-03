import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserDto } from 'src/users/dto/user.dto';

@ObjectType()
export class AuthResponse implements Partial<UserDto> {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  email: string;

  @Field(() => Boolean)
  emailVerified: boolean;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
