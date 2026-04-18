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
import { ProductVariantsService } from './product-variants.service';
import {
  PaginatedProductVariant,
  ProductVariant,
} from './entities/product-variant.entity';
import { CreateProductVariantInput } from './dto/create-product-variant.input';
import { UpdateProductVariantInput } from './dto/update-product-variant.input';
import { ProductVariantAttribute } from '../product-variant-attributes/entities/product-variant-attribute.entity';
import { GraphqlAppContext } from 'src/app.module';
import { ProductVariantImage } from 'src/entities/product-variant.image.entity';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { PaginationArgs } from 'src/lib/pagination.args';
import { Product } from 'src/products/entities/product.entity';
import { SortingArgs } from 'src/args/sorting-args';

@Resolver(() => ProductVariant)
export class ProductVariantsResolver {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @Query(() => PaginatedProductVariant, { name: 'searchProductVariants' })
  async querySearchProductVariants(
    @Args('searchTerm', { type: () => String, nullable: true })
    searchTerm: string | null,
    @Args() paginationArgs: PaginationArgs,
    @Args() sortingArgs: SortingArgs,
    @Args('attributeFilters', { type: () => [[String]], nullable: true })
    attributeFilters: string[][] | null,
  ): Promise<PaginatedProductVariant> {
    return this.productVariantsService.searchProductVariants(
      searchTerm,
      paginationArgs,
      sortingArgs,
      attributeFilters || undefined,
    );
  }

  @Query(() => [ProductVariant], { name: 'productVariantsByIds' })
  async queryProductVariantsByIds(
    @Args('ids', { type: () => [Int] }) ids: number[],
  ): Promise<ProductVariant[]> {
    return await this.productVariantsService.getProductVariantsByIds(ids);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => ProductVariant)
  createProductVariant(
    @Args('createProductVariantInput')
    createProductVariantInput: CreateProductVariantInput,
  ) {
    return this.productVariantsService.create(createProductVariantInput);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => ProductVariant)
  updateProductVariant(
    @Args('updateProductVariantInput')
    updateProductVariantInput: UpdateProductVariantInput,
  ) {
    return this.productVariantsService.update(updateProductVariantInput);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Int)
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

  @ResolveField(() => Product, { name: 'product' })
  async resolveProductVariantProduct(
    @Parent() productVariant: ProductVariant,
    @Context() ctx: GraphqlAppContext,
  ): Promise<Product> {
    return ctx.loaders.productVariantProductLoader.load(productVariant.id);
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
      isThumbnail: image.isThumbnail,
      url: this.productVariantsService.getImageUrl(image.fileName),
      productVariantId: image.productVariantId!,
    }));
  }

  @ResolveField(() => ProductVariantImage, {
    name: 'thumbnailImage',
    nullable: true,
  })
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
      isThumbnail: thumbnail.isThumbnail,
      productVariantId: thumbnail.productVariantId!,
      url: this.productVariantsService.getImageUrl(thumbnail.fileName),
    };
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Int)
  async removeProductVariantImage(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<number> {
    return this.productVariantsService.removeImage(id);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => ProductVariantImage)
  async setProductVariantThumbnailImage(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ProductVariantImage> {
    return this.productVariantsService.setThumbnailImage(id);
  }
}
