import { Field, Int, ObjectType } from '@nestjs/graphql';

import { ProductImage as DbProductImage } from 'generated/prisma/client';
import { BaseImageClass } from './image.base.entity';

@ObjectType()
export class ProductVariantImage
  extends BaseImageClass
  implements Partial<DbProductImage>
{
  @Field(() => Int)
  productVariantId: number;
}
