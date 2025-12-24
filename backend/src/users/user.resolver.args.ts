import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Role } from 'generated/prisma/enums';

@ArgsType()
export class UserFindAllQueryArgs {
  @Field(() => Int, { nullable: true })
  id: number | null;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => Role, { nullable: true })
  role: Role | null;
}

export enum UserSortingField {
  ID = 'id',
  EMAIL = 'email',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  ROLE = 'role',
}

registerEnumType(UserSortingField, {
  name: 'UserSortingField',
});

@ArgsType()
export class UserSortingArgs {
  @Field(() => UserSortingField, { nullable: true })
  sortBy: UserSortingField | null;

  @Field(() => Boolean, { nullable: true })
  ascending: boolean | null;
}
