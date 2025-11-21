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
import { ProductsService } from './products.service';
import { PaginatedProduct, Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PaginationArgs } from 'src/lib/pagination.args';
import {
  ProductFindAllQueryArgs,
  ProductFindOneQueryArgs,
} from './products.resolver.args';
import { UseGuards } from '@nestjs/common';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import {
  OptionalCurrentUser,
  OptionalCurrentUserDto,
} from 'src/auth/optional-current-user.decorator';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { GraphqlAppContext } from 'src/app.module';
import { ProductTranslation } from './entities/product-translation.entity';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';
import { ProductImage } from 'src/entities/product-image.entity';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AdminGuard)
  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return await this.productsService.create(createProductInput);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => PaginatedProduct, { name: 'products' })
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args() findAllQueryArgs: ProductFindAllQueryArgs,
    @OptionalCurrentUser() user: OptionalCurrentUserDto,
  ) {
    return this.productsService.findAll(
      paginationArgs,
      findAllQueryArgs,
      user?.role,
    );
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args() args: ProductFindOneQueryArgs) {
    return this.productsService.findOne(args);
  }

  @ResolveField(() => String, { name: 'name', nullable: true })
  async resolveProductName(
    @Parent() product: Product,
    @Context() ctx: GraphqlAppContext,
  ) {
    const productTranslation = await ctx.loaders.productTranslationLoader.load(
      product.id,
    );
    return productTranslation?.name ?? null;
  }

  @ResolveField(() => String, { name: 'description', nullable: true })
  async resolveProductDescription(
    @Parent() product: Product,
    @Context() ctx: GraphqlAppContext,
  ) {
    const productTranslation = await ctx.loaders.productTranslationLoader.load(
      product.id,
    );
    return productTranslation?.description ?? null;
  }

  @ResolveField(() => String, { name: 'markdownContent', nullable: true })
  async resolveProductContent(
    @Parent() product: Product,
    @Context() ctx: GraphqlAppContext,
  ) {
    const productTranslation = await ctx.loaders.productTranslationLoader.load(
      product.id,
    );
    return productTranslation?.markdownContent ?? null;
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Product)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productsService.update(
      updateProductInput.id,
      updateProductInput,
    );
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.remove(id);
  }

  @ResolveField(() => [ProductTranslation], { name: 'translations' })
  async resolveProductTranslations(
    @Parent() product: Product,
    @Context() ctx: GraphqlAppContext,
  ) {
    const translations = await ctx.loaders.productAllTranslationsLoader.load(
      product.id,
    );
    return translations;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ResolveField(() => [ProductVariant], { name: 'variants' })
  async resolveProductVariants(
    @Parent() product: Product,
    @Context() ctx: GraphqlAppContext,
    @Args('includeHidden', { type: () => Boolean, defaultValue: false })
    includeHidden: boolean,
    @OptionalCurrentUser() user: OptionalCurrentUserDto,
  ) {
    const variants = await ctx.loaders.productAllVariantsLoader.load(
      product.id,
    );

    if (user?.role !== 'ADMIN') {
      includeHidden = false;
    }

    if (includeHidden) {
      return variants;
    }
    return variants.filter((variant) => variant.isPublic);
  }

  @ResolveField(() => [ProductImage], { name: 'images' })
  async resolveProductImages(
    @Parent() product: Product,
    @Context() ctx: GraphqlAppContext,
  ): Promise<ProductImage[]> {
    const images = await ctx.loaders.productAllImagesLoader.load(product.id);
    return images.map((img) => ({
      id: img.id,
      base64: img.base64,
      isThumbnail: img.isThumbnail,
      mimeType: img.mimeType,
      productId: img.productId!,
    }));
  }

  @ResolveField(() => ProductImage, { name: 'thumbnailImage', nullable: true })
  async resolveProductThumbnailImage(
    @Parent() product: Product,
    @Context() ctx: GraphqlAppContext,
  ): Promise<ProductImage | null> {
    const images = await ctx.loaders.productAllImagesLoader.load(product.id);
    const thumbnail = images.find((img) => img.isThumbnail);
    if (!thumbnail) {
      return null;
    }
    return {
      id: thumbnail.id,
      base64: thumbnail.base64,
      isThumbnail: thumbnail.isThumbnail,
      mimeType: thumbnail.mimeType,
      productId: thumbnail.productId!,
    };
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Int)
  async deleteProductTranslation(
    @Args('productTranslationId', { type: () => Int })
    productTranslationId: number,
  ) {
    return await this.productsService.deleteProductTranslation(
      productTranslationId,
    );
  }
}
