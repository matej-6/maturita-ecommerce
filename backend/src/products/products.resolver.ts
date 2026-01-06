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
  ProductSortingArgs,
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
import { CreateProductTranslationInput } from './dto/create-product-translation.input';
import { EditProductTranslationInput } from './dto/edit-product-translation.input';
import { ProductEmbedding } from './entities/product-embedding.entity';
import { ProductContentEmbedding } from './entities/product-content-embedding.entity';
import { GraphQLVoid } from 'graphql-scalars';

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

  @UseGuards(AdminGuard)
  @Mutation(() => ProductTranslation)
  async createProductTranslation(
    @Args('productId', { type: () => Int }) productId: number,
    @Args('createProductTranslationInput')
    createProductTranslationInput: CreateProductTranslationInput,
  ) {
    return await this.productsService.createProductTranslation(
      productId,
      createProductTranslationInput,
    );
  }

  @UseGuards(AdminGuard)
  @Mutation(() => ProductTranslation)
  async editProductTranslation(
    @Args('editProductTranslationInput')
    editProductTranslationInput: EditProductTranslationInput,
  ) {
    return await this.productsService.editProductTranslation(
      editProductTranslationInput,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => PaginatedProduct, { name: 'products' })
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args() findAllQueryArgs: ProductFindAllQueryArgs,
    @Args() sortByArgs: ProductSortingArgs,
    @OptionalCurrentUser() user: OptionalCurrentUserDto,
  ) {
    return this.productsService.findAll(
      paginationArgs,
      findAllQueryArgs,
      sortByArgs,
      user?.role,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => [Product], { name: 'allProducts' })
  findAllWithoutPagination(
    @Args() findAllQueryArgs: ProductFindAllQueryArgs,
    @OptionalCurrentUser() user: OptionalCurrentUserDto,
  ) {
    return this.productsService.findAllWithoutPagination(
      findAllQueryArgs,
      user?.role,
    );
  }

  @UseGuards(AdminGuard)
  @Mutation(() => ProductImage)
  async addProductImage(
    @Args('productId', { type: () => Int }) productId: number,
    @Args('base64') base64: string,
    @Args('mimeType') mimeType: string,
  ) {
    return await this.productsService.addProductImage(
      productId,
      base64,
      mimeType,
    );
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Int)
  async deleteProductImage(
    @Args('productImageId', { type: () => Int }) productImageId: number,
  ) {
    return await this.productsService.deleteProductImage(productImageId);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => ProductImage)
  async setProductThumbnailImage(
    @Args('productImageId', { type: () => Int }) productImageId: number,
  ) {
    return await this.productsService.setProductImageThumbnail(productImageId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Query(() => Product, { name: 'product', nullable: true })
  findOne(
    @Args() args: ProductFindOneQueryArgs,
    @OptionalCurrentUser() user: OptionalCurrentUserDto,
  ) {
    return this.productsService.findOne(args, user?.role);
  }

  @Query(() => Product, { name: 'productBySlug', nullable: true })
  findOneBySlug(@Args('slug') slug: string) {
    return this.productsService.findOneBySlug(slug);
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

  @UseGuards(AdminGuard)
  @ResolveField(() => [ProductEmbedding], { name: 'embeddings' })
  async resolveProductEmbeddings(
    @Parent() product: Product,
  ): Promise<ProductEmbedding[]> {
    return await this.productsService.getProductEmbeddings(product.id);
  }

  @UseGuards(AdminGuard)
  @ResolveField(() => [ProductContentEmbedding], { name: 'contentEmbeddings' })
  async resolveProductContentEmbeddings(
    @Parent() product: Product,
  ): Promise<ProductContentEmbedding[]> {
    return await this.productsService.getProductContentEmbeddings(product.id);
  }

  @UseGuards(AdminGuard)
  @ResolveField(() => [String], { name: 'missingEmbeddingLanguages' })
  async resolveMissingEmbeddingLanguages(
    @Parent() product: Product,
  ): Promise<string[]> {
    return await this.productsService.getMissingProductEmbeddings(product.id);
  }

  @UseGuards(AdminGuard)
  @ResolveField(() => [String], { name: 'missingContentEmbeddingLanguages' })
  async resolveMissingContentEmbeddingLanguages(
    @Parent() product: Product,
  ): Promise<string[]> {
    return await this.productsService.getMissingProductContentEmbeddings(
      product.id,
    );
  }

  @UseGuards(AdminGuard)
  @Query(() => [ProductEmbedding], { name: 'productEmbeddings' })
  async queryProductEmbeddings(
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return await this.productsService.getProductEmbeddings(productId);
  }

  @UseGuards(AdminGuard)
  @Query(() => [ProductContentEmbedding], { name: 'productContentEmbeddings' })
  async queryProductContentEmbeddings(
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return await this.productsService.getProductContentEmbeddings(productId);
  }

  @UseGuards(AdminGuard)
  @Query(() => [String], { name: 'missingProductEmbeddingLanguages' })
  async queryMissingProductEmbeddingLanguages(
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return await this.productsService.getMissingProductEmbeddings(productId);
  }

  @UseGuards(AdminGuard)
  @Query(() => [String], { name: 'missingProductContentEmbeddingLanguages' })
  async queryMissingProductContentEmbeddingLanguages(
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return await this.productsService.getMissingProductContentEmbeddings(
      productId,
    );
  }

  @UseGuards(AdminGuard)
  @Query(() => ProductEmbedding, { name: 'productEmbedding', nullable: true })
  async queryProductEmbedding(@Args('id', { type: () => Int }) id: number) {
    return await this.productsService.getProductEmbeddingById(id);
  }

  @UseGuards(AdminGuard)
  @Query(() => ProductContentEmbedding, {
    name: 'productContentEmbedding',
    nullable: true,
  })
  async queryProductContentEmbedding(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return await this.productsService.getProductContentEmbeddingById(id);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => ProductEmbedding, {
    name: 'generateProductEmbedding',
    nullable: true,
  })
  async generateProductEmbedding(
    @Args('productId', { type: () => Int }) productId: number,
    @Args('lang', { type: () => String }) lang: string,
  ) {
    return await this.productsService.generateProductEmbedding(productId, lang);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => ProductContentEmbedding, {
    name: 'generateProductContentEmbedding',
    nullable: true,
  })
  async generateProductContentEmbedding(
    @Args('productId', { type: () => Int }) productId: number,
    @Args('lang', { type: () => String }) lang: string,
  ) {
    return await this.productsService.generateProductContentEmbedding(
      productId,
      lang,
    );
  }

  @UseGuards(AdminGuard)
  @Mutation(() => GraphQLVoid, {
    name: 'regenerateAllProductContentEmbeddings',
  })
  async regenerateAllProductContentEmbeddings() {
    await this.productsService.regenerateAllProductContentEmbeddings();
    return GraphQLVoid;
  }

  @UseGuards(AdminGuard)
  @Mutation(() => GraphQLVoid, {
    name: 'regenerateAllProductEmbeddings',
  })
  async regenerateAllProductEmbeddings() {
    await this.productsService.regenerateAllProductEmbeddings();
    return GraphQLVoid;
  }
}
