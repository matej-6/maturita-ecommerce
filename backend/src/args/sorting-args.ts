import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class SortingArgs {
  @Field(() => String, { nullable: true })
  sortBy: string | null;

  @Field(() => Boolean, { nullable: true })
  ascending: boolean | null;
}
