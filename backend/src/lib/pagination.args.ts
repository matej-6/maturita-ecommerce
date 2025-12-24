import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  cursor: number | null;
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  pageSize: number = 10;

  validateFields() {
    this.cursor = this.cursor != null ? Math.abs(this.cursor) : null;
    this.pageSize = Math.min(Math.max(1, this.pageSize), 50);
  }
}
