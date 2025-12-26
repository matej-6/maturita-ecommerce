import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductVariant } from 'src/product-variants/entities/product-variant.entity';

@ObjectType()
export class BestSellingProductVariant {
  @Field(() => ProductVariant)
  productVariant: ProductVariant;

  @Field(() => Int)
  quantitySold: number;
}
