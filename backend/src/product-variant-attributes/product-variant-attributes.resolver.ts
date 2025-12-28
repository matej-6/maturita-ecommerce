import {
  Resolver,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
  Query,
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
import { GraphQLVoid } from 'graphql-scalars';
import { CreateProductVariantAttributeTranslationInput } from './dto/create-product-variant-attribute-translation.input';
import { UpdateProductVariantAttributeTranslationInput } from './dto/update-product-variant-attribute-translation.input';
import { ProductVariant } from 'src/product-variants/entities/product-variant.entity';

@Resolver(() => ProductVariantAttribute)
export class ProductVariantAttributesResolver {
  constructor(
    private readonly productVariantAttributesService: ProductVariantAttributesService,
  ) {}

  @Query(() => [ProductVariantAttribute], { name: 'productVariantAttributes' })
  productVariantAttributes() {
    return this.productVariantAttributesService.findAll();
  }

  @Query(() => ProductVariantAttribute, { nullable: true })
  findOneProductVariantAttribute(@Args('id', { type: () => Int }) id: number) {
    return this.productVariantAttributesService.findOne(id);
  }

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
  @Mutation(() => GraphQLVoid)
  async removeProductVariantAttribute(
    @Args('id', { type: () => Int }) id: number,
  ) {
    await this.productVariantAttributesService.remove(id);
    return GraphQLVoid;
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

  @ResolveField(() => [ProductVariant], { name: 'productVariants' })
  async resolveProductVariants(
    @Parent() productVariantAttribute: ProductVariantAttribute,
    @Context() ctx: GraphqlAppContext,
  ) {
    return ctx.loaders.productVariantsByAttributeIdLoader.load(
      productVariantAttribute.id,
    );
  }
  @UseGuards(AdminGuard)
  @Mutation(() => GraphQLVoid)
  async removeProductVariantAttributeTranslation(
    @Args('id', { type: () => Int }) id: number,
  ) {
    await this.productVariantAttributesService.deleteTranslation(id);
    return GraphQLVoid;
  }

  @UseGuards(AdminGuard)
  @Mutation(() => ProductVariantAttributeTranslation)
  async createProductVariantAttributeTranslation(
    @Args('input') input: CreateProductVariantAttributeTranslationInput,
  ) {
    return this.productVariantAttributesService.createTranslation(input);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => ProductVariantAttributeTranslation)
  async updateProductVariantAttributeTranslation(
    @Args('input') input: UpdateProductVariantAttributeTranslationInput,
  ) {
    return this.productVariantAttributesService.updateTranslation(input);
  }
}
