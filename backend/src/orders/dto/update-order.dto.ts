import { Field, InputType } from '@nestjs/graphql';
import { OrderStatus } from 'generated/prisma/enums';

@InputType()
export class UpdateOrderDto {
  @Field(() => OrderStatus)
  status: OrderStatus;
}
