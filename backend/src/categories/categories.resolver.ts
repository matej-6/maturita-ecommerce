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
import { EditCategoryTranslationInput } from './dto/edit-category-translation.input';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

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
    @Args('filtersInput', {
      type: () => CategoryFindAllQueryFilterInput,
      nullable: true,
    })
    filterInput: CategoryFindAllQueryFilterInput,
  ) {
    const serviceFilter =
      CategoriesServiceFindAllFilter.fromCategoryFindAllQueryFilterInput(
        filterInput,
        currentUser?.role,
      );
    return this.categoriesService.findAll(serviceFilter);
  }

  @Query(() => Category, { name: 'category' })
  @UseGuards(OptionalJwtAuthGuard)
  findOne(
    @OptionalCurrentUser() currentUser: OptionalCurrentUserDto,
    @Args('id', { type: () => ID }) id: number,
    @Args('filters', {
      type: () => CategoryFindOneQueryFilterInput,
      nullable: true,
    })
    filterInput: CategoryFindOneQueryFilterInput | null,
  ) {
    const serviceFilter =
      CategoriesServiceFindOneFilter.fromCategoryFindOneQueryFilterInput(
        filterInput,
        currentUser?.role,
      );
    return this.categoriesService.findOne(id, serviceFilter);
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
  async removeCategory(@Args('id', { type: () => ID }) id: number) {
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
    @Args('filtersInput') filtersInput: CategoryTranslationsQueryFilter,
  ) {
    const { id } = category;
    const serviceFilters =
      CategoriesServiceTranslationFilter.fromCategoryTranslationsQueryFilter(
        filtersInput,
      );
    return await this.categoriesService.findTranslations(id, serviceFilters);
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
  @Mutation(() => ID, { name: 'deleteCategoryTranslation' })
  async deleteCategoryTranslationMutation(
    @Args('categoryTranslationId', { type: () => ID })
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
