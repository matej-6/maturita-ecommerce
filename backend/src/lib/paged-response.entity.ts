import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class PagedResponse {
  @Field(() => Int, {
    description: 'the page identifier of last item in previous query',
  })
  _cursor: number;

  @Field(() => Int)
  _pageSize: number;
}
