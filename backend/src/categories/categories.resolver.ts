import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
  Int,
} from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category, PaginatedCategory } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { GraphqlAppContext } from 'src/app.module';
import { CategoryTranslation } from './entities/category-translation.entity';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import {
  OptionalCurrentUser,
  OptionalCurrentUserDto,
} from 'src/auth/optional-current-user.decorator';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CreateCategoryTranslationInput } from './dto/create-category-translation.input';
import {
  CategoryFindAllQueryFilterArgs,
  CategoryFindOneQueryFilterArgs,
  CategorySortByArgs,
  CategoryTranslationsQueryFilterArgs,
} from './categories.resolver.args';
import { EditCategoryTranslationInput } from './dto/edit-category-translation.input';
import { PaginationArgs } from 'src/lib/pagination.args';
import { PaginatedProduct } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @UseGuards(AdminGuard)
  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  @UseGuards(OptionalJwtAuthGuard)
  findAll(
    @OptionalCurrentUser() currentUser: OptionalCurrentUserDto,
    @Args() filterArgs: CategoryFindAllQueryFilterArgs,
    @Args() sortingArgs: CategorySortByArgs,
  ) {
    return this.categoriesService.findAll(
      filterArgs,
      sortingArgs,
      currentUser?.role,
    );
  }

  @Query(() => PaginatedCategory, { name: 'paginatedCategories' })
  @UseGuards(OptionalJwtAuthGuard)
  findPaginated(
    @OptionalCurrentUser() currentUser: OptionalCurrentUserDto,
    @Args() filterArgs: CategoryFindAllQueryFilterArgs,
    @Args() sortingArgs: CategorySortByArgs,
    @Args() paginationArgs: PaginationArgs,
  ) {
    return this.categoriesService.findPaginated(
      filterArgs,
      sortingArgs,
      paginationArgs,
      currentUser?.role,
    );
  }

  @Query(() => Category, { name: 'category' })
  @UseGuards(OptionalJwtAuthGuard)
  findOne(
    @OptionalCurrentUser() currentUser: OptionalCurrentUserDto,
    @Args('id', { type: () => Int, nullable: true }) id: number | null,
    @Args('slug', { type: () => String, nullable: true }) slug: string | null,
    @Args() filterArgs: CategoryFindOneQueryFilterArgs,
  ) {
    if (id == null && slug == null) {
      throw new BadRequestException();
    }
    return this.categoriesService.findOne(
      id,
      slug,
      filterArgs,
      currentUser?.role,
    );
  }

  @Query(() => PaginatedProduct, { name: 'categoryProducts' })
  async findCategoryProducts(
    @Args('categorySlug', { type: () => String }) categorySlug: string,
    @Args() paginationArgs: PaginationArgs,
  ): Promise<PaginatedProduct> {
    const category = await this.categoriesService.findOne(null, categorySlug, {
      isPublic: true,
      isSetup: true,
    });

    if (!category) {
      return {
        edges: [],
        hasNextPage: false,
        totalCount: 0,
      };
    }

    return await this.productsService.findAll(
      paginationArgs,
      {
        categoryId: category.id,
        isPublic: true,
        isSetup: true,
        slug: null,
      },
      {
        ascending: null,
        sortBy: null,
      },
    );
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Category)
  async updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return await this.categoriesService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Category)
  async removeCategory(@Args('id', { type: () => Int }) id: number) {
    return await this.categoriesService.remove(id);
  }

  @ResolveField(() => [Category], { name: 'subcategories' })
  async subcategories(
    @Parent() category: Category,
    @Context() { loaders }: GraphqlAppContext,
  ) {
    const { id } = category;
    return loaders.subcategoriesLoader.load(id);
  }

  @UseGuards(AdminGuard)
  @ResolveField(() => [CategoryTranslation], { name: 'translations' })
  async translations(
    @Parent() category: Category,
    @Args() filterArgs: CategoryTranslationsQueryFilterArgs,
  ) {
    const { id } = category;
    return await this.categoriesService.findTranslations(id, filterArgs);
  }

  @UseGuards(AdminGuard)
  @Mutation(() => CategoryTranslation)
  async createCategoryTranslation(
    @Args('newTranslationinput')
    input: CreateCategoryTranslationInput,
  ) {
    return await this.categoriesService.createTranslation(
      input.categoryId,
      input,
    );
  }

  @UseGuards(AdminGuard)
  @Mutation(() => CategoryTranslation, { name: 'updateCategoryTranslation' })
  async updateCategoryTranslationMutation(
    @Args('editTranslationInput')
    input: EditCategoryTranslationInput,
  ) {
    return await this.categoriesService.editTranslation(
      input.categoryTranslationId,
      input,
    );
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Int, { name: 'deleteCategoryTranslation' })
  async deleteCategoryTranslationMutation(
    @Args('categoryTranslationId', { type: () => Int })
    categoryTranslationId: number,
  ) {
    const res = await this.categoriesService.removeTranslation(
      categoryTranslationId,
    );

    return res;
  }

  @ResolveField(() => String, { name: 'name', nullable: true })
  async categoryName(
    @Parent() category: Category,
    @Context() ctx: GraphqlAppContext,
  ) {
    const res = await ctx.loaders.categoryTranslationLoader.load(category.id);

    return res?.name || null;
  }

  @ResolveField(() => Int, { name: 'productsCount' })
  async getProductsCount(
    @Parent() category: Category,
    @Context() ctx: GraphqlAppContext,
  ) {
    const count = await ctx.loaders.categoryProductsCountLoader.load(
      category.id,
    );
    return count;
  }

  @UseGuards(AdminGuard)
  @ResolveField(() => Boolean, { name: 'isSetup' })
  categoryIsSetup(@Parent() category: Category) {
    return category.isSetup;
  }

  @ResolveField(() => String, { name: 'description' })
  async resolveCategoryDescription(
    @Parent() category: Category,
    @Context() ctx: GraphqlAppContext,
  ) {
    const res = await ctx.loaders.categoryTranslationLoader.load(category.id);
    return res?.description ?? null;
  }
}
