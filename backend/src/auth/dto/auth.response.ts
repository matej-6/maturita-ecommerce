import { Field, ObjectType } from '@nestjs/graphql';
import { UserDto } from 'src/users/dto/user.dto';

@ObjectType()
export class AuthResponse implements Partial<UserDto> {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => Boolean)
  emailVerified: boolean;

  @Field(() => String, { nullable: true })
  firstName: string | null;

  @Field(() => String, { nullable: true })
  lastName: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
