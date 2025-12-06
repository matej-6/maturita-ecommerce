import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PageOptionsInput {
  @Field(() => Int, {
    description: 'the page identifier of last item in previous query',
  })
  cursor: number;

  @Field(() => Int, { nullable: true })
  pageSize: number | null;
}
