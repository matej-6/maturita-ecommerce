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
import { ProductVariantAttributeKeysService } from './product-variant-attribute-keys.service';
import { ProductVariantAttributeKey } from './entities/product-variant-attribute-key.entity';
import { CreateProductVariantAttributeKeyInput } from './dto/create-product-variant-attribute-key.input';
import { UpdateProductVariantAttributeKeyInput } from './dto/update-product-variant-attribute-key.input';
import { GraphqlAppContext } from 'src/app.module';
import { ProductVariantAttributeKeyTranslation } from './entities/product-variant-attribute-key-translation.entity';
import { ProductVariantAttribute } from 'src/product-variant-attributes/entities/product-variant-attribute.entity';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Resolver(() => ProductVariantAttributeKey)
export class ProductVariantAttributeKeysResolver {
  constructor(
    private readonly productVariantAttributeKeysService: ProductVariantAttributeKeysService,
  ) {}

  @UseGuards(AdminGuard)
  @Mutation(() => ProductVariantAttributeKey)
  createProductVariantAttributeKey(
    @Args('createProductVariantAttributeKeyInput')
    createProductVariantAttributeKeyInput: CreateProductVariantAttributeKeyInput,
  ) {
    return this.productVariantAttributeKeysService.create(
      createProductVariantAttributeKeyInput,
    );
  }

  @Query(() => [ProductVariantAttributeKey], {
    name: 'productVariantAttributeKeys',
  })
  findAll(
    @Args({ name: 'productId', type: () => Int, nullable: true })
    productId?: number | null,
  ) {
    return this.productVariantAttributeKeysService.findAll(productId ?? null);
  }

  @Query(() => ProductVariantAttributeKey, {
    name: 'productVariantAttributeKey',
  })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.productVariantAttributeKeysService.findOne(id);
  }

  @Mutation(() => ProductVariantAttributeKey)
  updateProductVariantAttributeKey(
    @Args('updateProductVariantAttributeKeyInput')
    updateProductVariantAttributeKeyInput: UpdateProductVariantAttributeKeyInput,
  ) {
    return this.productVariantAttributeKeysService.update(
      updateProductVariantAttributeKeyInput,
    );
  }

  @Mutation(() => ProductVariantAttributeKey)
  removeProductVariantAttributeKey(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.productVariantAttributeKeysService.remove(id);
  }

  @ResolveField(() => String, { name: 'translatedKey', nullable: true })
  async resolveTranslatedKey(
    @Parent() productVariantAttributeKey: ProductVariantAttributeKey,
    @Context() ctx: GraphqlAppContext,
  ) {
    const res = await ctx.loaders.attributeKeyTranslationLoader.load(
      productVariantAttributeKey.id,
    );
    return res?.keyTranslation || null;
  }

  @ResolveField(() => [ProductVariantAttributeKeyTranslation], {
    name: 'translations',
  })
  async resolveTranslations(
    @Parent() productVariantAttributeKey: ProductVariantAttributeKey,
    @Context() ctx: GraphqlAppContext,
  ) {
    return ctx.loaders.attributeKeyAllTranslationsLoader.load(
      productVariantAttributeKey.id,
    );
  }

  @ResolveField(() => [ProductVariantAttribute], { name: 'attributes' })
  async resolveAttributes(
    @Parent() productVariantAttributeKey: ProductVariantAttributeKey,
    @Context() ctx: GraphqlAppContext,
  ) {
    return ctx.loaders.attributesByKeyLoader.load(
      productVariantAttributeKey.id,
    );
  }
}
