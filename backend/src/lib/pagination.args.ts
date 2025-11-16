import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  cursor: number | null;
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  pageSize: number = 10;
}
