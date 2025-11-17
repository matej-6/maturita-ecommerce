import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductVariantInput } from './dto/create-product-variant.input';
import { UpdateProductVariantInput } from './dto/update-product-variant.input';
import { ProductVariantAttribute } from '../product-variant-attributes/entities/product-variant-attribute.entity';
import { GraphqlAppContext } from 'src/app.module';

@Resolver(() => ProductVariant)
export class ProductVariantsResolver {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Mutation(() => ProductVariant)
  createProductVariant(
    @Args('createProductVariantInput')
    createProductVariantInput: CreateProductVariantInput,
  ) {
    return this.productVariantsService.create(createProductVariantInput);
  }

  @Mutation(() => ProductVariant)
  updateProductVariant(
    @Args('updateProductVariantInput')
    updateProductVariantInput: UpdateProductVariantInput,
  ) {
    return this.productVariantsService.update(
      updateProductVariantInput.id,
      updateProductVariantInput,
    );
  }

  @Mutation(() => ProductVariant)
  removeProductVariant(@Args('id', { type: () => Int }) id: number) {
    return this.productVariantsService.remove(id);
  }

  @ResolveField(() => [ProductVariantAttribute], { name: 'attributes' })
  async resolveProductVariantAttributes(
    @Parent() productVariant: ProductVariant,
    @Context() ctx: GraphqlAppContext,
  ) {
    return ctx.loaders.productVariantAllAttributesLoader.load(
      productVariant.id,
    );
  }
}
