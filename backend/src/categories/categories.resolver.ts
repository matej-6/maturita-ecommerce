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
import { NotFoundException, UseGuards } from '@nestjs/common';
import { GqlAdminGuard } from 'src/auth/guards/gql-admin.guard';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  findAll(
    @Args('parentId', {
      name: 'parentId',
      description:
        'gets subcategories of a category with provided parentId, to fetch all categories with no parent id, set the value to an emtpy string: ""',
    })
    parentId: string,
  ) {
    return this.categoriesService.findAll(parentId);
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Mutation(() => Category)
  removeCategory(@Args('id', { type: () => ID }) id: string) {
    return this.categoriesService.remove(id);
  }

  @ResolveField(() => [Category], { name: 'subcategories' })
  async subcategories(
    @Parent() category: Category,
    @Context() { loaders }: GraphqlAppContext,
  ) {
    const { id } = category;
    return loaders.subcategoriesLoader.load(id);
  }

  @UseGuards(GqlAdminGuard)
  @ResolveField(() => [CategoryTranslation], { name: 'translations' })
  async translations(
    @Parent() category: Category,
    @Args('langs', {
      type: () => [String],
      nullable: true,
      description:
        'Filter translations by languages. Leave empty or provide an empty array to get all translations.',
    })
    langs?: string[],
  ) {
    const { id } = category;
    return this.categoriesService.findTranslations(id, langs);
  }

  @ResolveField(() => String, { name: 'name' })
  async categoryName(
    @Parent() category: Category,
    @Context() ctx: GraphqlAppContext,
  ) {
    const res = await ctx.loaders.categoryTranslationLoader.load(category.id);
    if (!res?.name) {
      throw new NotFoundException();
    }

    return res.name;
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
