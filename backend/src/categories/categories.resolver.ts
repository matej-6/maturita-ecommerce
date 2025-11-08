import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { GraphqlAppContext } from 'src/app.module';
import { CategoryTranslation } from './entities/category-translation.entity';
import { UseGuards } from '@nestjs/common';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import {
  OptionalCurrentUser,
  OptionalCurrentUserDto,
} from 'src/auth/optional-current-user.decorator';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CreateCategoryTranslationInput } from './dto/create-category-translation.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  CategoryFindAllQueryFilterInput,
  CategoryFindOneQueryFilterInput,
  CategoryTranslationsQueryFilter,
} from './categories.resolver.filters';
import {
  CategoriesServiceFindAllFilter,
  CategoriesServiceFindOneFilter,
  CategoriesServiceTranslationFilter,
} from './categories.service.filters';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.create(createCategoryInput);
  }

  // filters:
  // isPublic: guest => true; user => true; admin => true, false
  // parentId: guest => *; user => *; admin => *
  @Query(() => [Category], { name: 'categories' })
  @UseGuards(new OptionalJwtAuthGuard())
  findAll(
    @OptionalCurrentUser() currentUser: OptionalCurrentUserDto,

    @Args('filters', { nullable: true })
    filterInput: CategoryFindAllQueryFilterInput,
  ) {
    const serviceFilter =
      CategoriesServiceFindAllFilter.fromCategoryFindAllQueryFilterInput(
        filterInput,
      );
    return this.categoriesService.findAll(serviceFilter);
  }

  @Query(() => Category, { name: 'category' })
  @UseGuards(OptionalJwtAuthGuard)
  findOne(
    @OptionalCurrentUser() currentUser: OptionalCurrentUserDto,
    @Args('id', { type: () => ID }) id: string,
    @Args('filters', { nullable: true })
    filterInput: CategoryFindOneQueryFilterInput | null,
  ) {
    const serviceFilter =
      CategoriesServiceFindOneFilter.fromCategoryFindOneQueryFilterInput(
        filterInput,
        currentUser?.role,
      );
    return this.categoriesService.findOne(id, serviceFilter);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Mutation(() => Category)
  async updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return await this.categoriesService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Mutation(() => Category)
  async removeCategory(@Args('id', { type: () => ID }) id: string) {
    return await this.categoriesService.remove(id);
  }

  // filters:
  // isPublic: guest => true; user => true; admin => true, false
  @ResolveField(() => [Category], { name: 'subcategories' })
  async subcategories(
    @Parent() category: Category,
    @Context() { loaders }: GraphqlAppContext,
  ) {
    const { id } = category;
    return loaders.subcategoriesLoader.load(id);
  }

  // filters:
  // langs: guest => [x, backup_x?]; user => [x, backup_x?]; admin => [x, backup_x], [...x], [*]
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ResolveField(() => [CategoryTranslation], { name: 'translations' })
  async translations(
    @Parent() category: Category,
    @Args('filtersInput') filtersInput: CategoryTranslationsQueryFilter,
  ) {
    const { id } = category;
    const serviceFilters =
      CategoriesServiceTranslationFilter.fromCategoryTranslationsQueryFilter(
        filtersInput,
      );
    return await this.categoriesService.findTranslations(id, serviceFilters);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
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

  @ResolveField(() => String, { name: 'name', nullable: true })
  async categoryName(
    @Parent() category: Category,
    @Context() ctx: GraphqlAppContext,
  ) {
    const res = await ctx.loaders.categoryTranslationLoader.load(category.id);

    return res?.name || null;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ResolveField(() => Boolean, { name: 'isSetup' })
  async categoryIsSetup(@Parent() category: Category) {
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
