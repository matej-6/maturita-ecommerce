import { ObjectType, Field } from '@nestjs/graphql';
import { UserDto } from 'src/users/dto/user.dto';

@ObjectType()
export class ProductReviewAuthor implements Partial<UserDto> {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, { nullable: true })
  avatarUrl: string | null;
}
