import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/categories/entities/category.entity';

@ObjectType()
export class BestSellingCategory {
  @Field(() => Category)
  category: Category;

  @Field(() => Int)
  itemsSold: number;

  @Field(() => Number)
  totalRevenueInCents: number;
}
