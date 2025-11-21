import {
  Resolver,
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
import { ProductVariantImage } from 'src/entities/product-variant.image.entity';

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

  @ResolveField(() => [ProductVariantImage], { name: 'images' })
  async resolveProductVariantImages(
    @Parent() productVariant: ProductVariant,
    @Context() ctx: GraphqlAppContext,
  ): Promise<ProductVariantImage[]> {
    return (
      await ctx.loaders.productVariantAllImagesLoader.load(productVariant.id)
    ).map((image) => ({
      id: image.id,
      base64: image.base64,
      mimeType: image.mimeType,
      isThumbnail: image.isThumbnail,
      productVariantId: image.productVariantId!,
    }));
  }

  @ResolveField(() => ProductVariantImage, { name: 'thumbnailImage' })
  async resolveProductVariantThumbnailImage(
    @Parent() productVariant: ProductVariant,
    @Context() ctx: GraphqlAppContext,
  ): Promise<ProductVariantImage | null> {
    const images = await ctx.loaders.productVariantAllImagesLoader.load(
      productVariant.id,
    );
    const thumbnail = images.find((img) => img.isThumbnail);
    if (!thumbnail) {
      return null;
    }
    return {
      id: thumbnail.id,
      base64: thumbnail.base64,
      mimeType: thumbnail.mimeType,
      isThumbnail: thumbnail.isThumbnail,
      productVariantId: thumbnail.productVariantId!,
    };
  }
}
