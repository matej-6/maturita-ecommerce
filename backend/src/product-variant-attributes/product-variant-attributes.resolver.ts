import {
  Resolver,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { ProductVariantAttributesService } from './product-variant-attributes.service';
import { ProductVariantAttribute } from './entities/product-variant-attribute.entity';
import { CreateProductVariantAttributeInput } from './dto/create-product-variant-attribute.input';
import { UpdateProductVariantAttributeInput } from './dto/update-product-variant-attribute.input';
import { ProductVariantAttributeKey } from '../product-variant-attribute-keys/entities/product-variant-attribute-key.entity';
import { GraphqlAppContext } from 'src/app.module';
import { ProductVariantAttributeTranslation } from './entities/product-variant-attribute-translation.entity';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Resolver(() => ProductVariantAttribute)
export class ProductVariantAttributesResolver {
  constructor(
    private readonly productVariantAttributesService: ProductVariantAttributesService,
  ) {}

  @UseGuards(AdminGuard)
  @Mutation(() => ProductVariantAttribute)
  createProductVariantAttribute(
    @Args('createProductVariantAttributeInput')
    createProductVariantAttributeInput: CreateProductVariantAttributeInput,
  ) {
    return this.productVariantAttributesService.create(
      createProductVariantAttributeInput,
    );
  }

  @UseGuards(AdminGuard)
  @Mutation(() => ProductVariantAttribute)
  updateProductVariantAttribute(
    @Args('updateProductVariantAttributeInput')
    updateProductVariantAttributeInput: UpdateProductVariantAttributeInput,
  ) {
    return this.productVariantAttributesService.update(
      updateProductVariantAttributeInput,
    );
  }

  @UseGuards(AdminGuard)
  @Mutation(() => ProductVariantAttribute)
  removeProductVariantAttribute(@Args('id', { type: () => Int }) id: number) {
    return this.productVariantAttributesService.remove(id);
  }

  @ResolveField(() => ProductVariantAttributeKey, {
    name: 'key',
    nullable: true,
  })
  async resolveAttributeKey(
    @Parent() productVariantAttribute: ProductVariantAttribute,
    @Context() ctx: GraphqlAppContext,
  ) {
    return ctx.loaders.attributeKeyByIdLoader.load(
      productVariantAttribute.attributeKeyId,
    );
  }

  @ResolveField(() => String, { name: 'translatedValue', nullable: true })
  async resolveTranslatedValue(
    @Parent() productVariantAttribute: ProductVariantAttribute,
    @Context() ctx: GraphqlAppContext,
  ) {
    const res = await ctx.loaders.productVariantAttributeTranslationLoader.load(
      productVariantAttribute.id,
    );

    return res?.value || null;
  }

  @ResolveField(() => [ProductVariantAttributeTranslation], {
    name: 'translations',
  })
  async resolveTranslations(
    @Parent() productVariantAttribute: ProductVariantAttribute,
    @Context() ctx: GraphqlAppContext,
  ) {
    return ctx.loaders.productVariantAttributeAllTranslationsLoader.load(
      productVariantAttribute.id,
    );
  }
}
