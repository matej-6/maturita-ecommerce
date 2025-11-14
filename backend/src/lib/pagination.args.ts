import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 0 })
  cursor: number = 0;

  @Field(() => Int, { defaultValue: 10 })
  pageSize: number = 10;
}
