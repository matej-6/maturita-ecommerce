import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Category as DbCategory,
  CategoryTranslation,
} from 'generated/prisma/client';
import { LocalesService } from 'src/locales/locales.service';
import { DEFAULT_LOCALE } from 'src/locales';
import { CreateCategoryTranslationInput } from './dto/create-category-translation.input';
import {
  CategoriesServiceFindAllFilter,
  CategoriesServiceFindOneFilter,
  CategoriesServiceTranslationFilter,
} from './categories.service.filters';
import { EditCategoryTranslationInput } from './dto/edit-category-translation.input';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import { ProductsService } from 'src/products/products.service';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  private readonly CATEGORIES_CACHE_KEY = 'app:categories';
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localesService: LocalesService,
    private readonly productsService: ProductsService,
  ) {}
  async create(createCategoryInput: CreateCategoryInput) {
    // ak uz existuje takato kategoria => error
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        slug: createCategoryInput.slug,
      },
    });

    if (existingCategory) {
      this.logger.error(
        'A category with this slug already exists: ',
        createCategoryInput.slug,
      );
      throw new BadRequestException('categories.service.slugAlreadyInUse');
    }

    return this.prisma.category.create({
      data: {
        ...createCategoryInput,
      },
    });
  }

  async createTranslation(
    categoryId: number,
    input: CreateCategoryTranslationInput,
  ): Promise<CategoryTranslation> {
    const localeCode = this.localesService.findOne(input.localeCode);
    if (!localeCode) {
      throw new BadRequestException('categories.service.invalidLocaleCode');
    }

    const res = await this.prisma.categoryTranslation.create({
      data: {
        locale: localeCode.code,
        name: input.name,
        description: input.description,
        isActive: true,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    return res;
  }

  async editTranslation(
    translationId: number,
    input: EditCategoryTranslationInput,
  ) {
    this.logger.log(`updating category translation with ID: ${translationId}`);
    const localeCode = this.localesService.findOne(input.localeCode)?.code;
    if (!localeCode) {
      throw new BadRequestException('categories.service.invalidLocaleCode');
    }

    const originalTranslation = await this.prisma.categoryTranslation.findFirst(
      {
        where: {
          id: translationId,
        },
      },
    );

    if (!originalTranslation) {
      throw new BadRequestException(
        'categories.service.editTranslation.notFound',
      );
    }

    if (originalTranslation?.locale !== localeCode) {
      const otherTranslation = await this.prisma.categoryTranslation.findFirst({
        where: {
          categoryId: originalTranslation.categoryId,
          locale: localeCode,
        },
      });

      if (otherTranslation !== null) {
        throw new BadRequestException(
          'categories.service.editTranslation.translationWithThisLocaleAlreadyExists',
        );
      }
    }

    const res = await this.prisma.categoryTranslation.update({
      where: {
        id: translationId,
      },
      data: {
        name: input.name,
        description: input.description || null,
        locale: localeCode,
      },
    });

    return res;
  }

  async removeTranslation(id: number) {
    this.logger.log(`deleting category translation with ID: ${id}`);
    try {
      const translation = await this.prisma.categoryTranslation.delete({
        where: {
          id: id,
        },
        select: {
          id: true,
          categoryId: true,
        },
      });

      return translation.id;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new BadRequestException(
            'categories.service.removeTranslation.notFound',
          );
        }
      }
      throw e;
    }
  }

  private getCategoryCacheKey(id: number): string {
    return `${this.CATEGORIES_CACHE_KEY}:${id}`;
  }

  async findAll(filter: CategoriesServiceFindAllFilter): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        parentCategoryId:
          filter.parentCategoryId === 0 ? undefined : filter.parentCategoryId,
        isPublic: filter.isPublic == null ? undefined : filter.isPublic,
      },
      select: {
        id: true,
        isPublic: true,
        slug: true,
        parentCategoryId: true,
        updatedAt: true,
        createdAt: true,
        _count: {
          select: {
            Products: true,
            CategoryTranslation: {
              where: {
                locale: {
                  equals: this.localesService.locales().english.code,
                },
              },
            },
          },
        },
      },
    });

    return categories
      .map((category) => ({
        ...category,
        isSetup: this.getIsSetup(
          category._count.Products,
          category._count.CategoryTranslation > 0,
        ),
      }))
      .filter(
        (category) =>
          filter.isSetup == null || category.isSetup === filter.isSetup,
      );
  }

  async findOne(
    id: number,
    filter: CategoriesServiceFindOneFilter,
  ): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: id,
        isPublic: filter.isPublic == null ? undefined : filter.isPublic,
      },
      select: {
        id: true,
        slug: true,
        parentCategoryId: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            Products: true,
            CategoryTranslation: {
              where: {
                locale: {
                  equals: this.localesService.locales().english.code,
                },
              },
            },
          },
        },
      },
    });

    if (!category) return null;

    const isSetup = this.getIsSetup(
      category._count.Products,
      category._count.CategoryTranslation > 0,
    );

    if (filter.isSetup != null && filter.isSetup !== isSetup) {
      return null;
    }

    return {
      ...category,
      isSetup: isSetup,
    };
  }

  private getIsSetup(
    productCount: number,
    hasEnglishTranslation: boolean,
  ): boolean {
    return productCount > 0 && hasEnglishTranslation;
  }

  async update(id: number, updateCategoryInput: UpdateCategoryInput) {
    const currentCategory = await this.prisma.category.findFirst({
      where: { id },
      select: {
        id: true,
        parentCategoryId: true,
      },
    });

    if (!currentCategory) {
      throw new BadRequestException(
        'categories.service.update.categoryNotFound',
      );
    }

    const countCategoriesWithNewSlug = await this.prisma.category.count({
      where: {
        slug: updateCategoryInput.slug,
      },
    });

    if (countCategoriesWithNewSlug > 0) {
      throw new BadRequestException('categories.service.slugAlreadyInUse');
    }

    if (updateCategoryInput.parentCategoryId != null) {
      const categorySubcategoriesMap = new Map<number, Set<number>>();
      (
        await this.prisma.category.findMany({
          select: {
            parentCategoryId: true,
            id: true,
          },
        })
      )
        .filter((c) => c.parentCategoryId != null)
        .map((category) => {
          if (categorySubcategoriesMap.has(category.parentCategoryId!)) {
            categorySubcategoriesMap
              .get(category.parentCategoryId!)!
              .add(category.id);
          } else {
            categorySubcategoriesMap.set(
              category.parentCategoryId!,
              new Set([category.id]),
            );
          }
        });

      const seen = new Set();
      const queue = [currentCategory.id];

      while (queue.length > 0) {
        const cid = queue.pop()!;
        if (seen.has(cid)) {
          this.logger.warn(`Category ${cid} is part of a circular chain`);
          continue;
        }
        seen.add(cid);
        const subcategories = categorySubcategoriesMap.get(cid);
        for (const sub of subcategories ?? []) {
          if (sub === updateCategoryInput.parentCategoryId) {
            throw new BadRequestException();
          }
          queue.push(sub);
        }
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        slug: updateCategoryInput.slug,
        parentCategoryId: updateCategoryInput.parentCategoryId,
      },
    });
  }

  async remove(id: number) {
    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. odstranit vsetky translations
        await tx.categoryTranslation.deleteMany({
          where: {
            categoryId: id,
          },
        });

        // 2. odstranit category
        await tx.category.delete({
          where: { id },
        });
      });

      await this.productsService.removeCategoryFromProducts(id);
    } catch (error) {
      this.logger.error(
        `Failed to remove category with id ${id}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async findAllSubcategoriesByParentIds(
    parentIds: number[],
  ): Promise<DbCategory[]> {
    return await this.prisma.category.findMany({
      where: {
        parentCategoryId: {
          in: parentIds,
        },
      },
    });
  }

  async getCategorySubcategoriesByBatch(
    parentIds: number[],
  ): Promise<(DbCategory[] | null)[]> {
    const categories = await this.findAllSubcategoriesByParentIds(parentIds);
    return parentIds.map(
      (parentId) =>
        categories.filter(
          (category) => category.parentCategoryId === parentId,
        ) || null,
    );
  }

  async findTranslation(categoryId: number, locale: string) {
    return this.prisma.categoryTranslation.findFirst({
      where: {
        categoryId: categoryId,
        locale: locale,
      },
    });
  }

  /**
   * Metóda navrhnutá pre data loader
   * source: @link https://blog.logrocket.com/use-dataloader-nestjs/#setting-up-nestjs-graphql
   * @param lang
   * @param categoryIds
   * @returns
   */
  async getAllTranslationsByBatch(
    lang: string,
    categoryIds: number[],
  ): Promise<(CategoryTranslation | null)[]> {
    const categoryTranslations = await this.prisma.categoryTranslation.findMany(
      {
        where: {
          categoryId: {
            in: categoryIds,
          },
          locale: {
            in: [lang, DEFAULT_LOCALE.code],
          },
        },
      },
    );

    return categoryIds.map((id) => {
      const cts = categoryTranslations.filter((ct) => ct.categoryId === id);
      if (cts.length === 0) return null;
      return cts.find((ct) => ct.locale === lang) || cts[0];
    });
  }

  async findTranslations(
    id: number,
    filters: CategoriesServiceTranslationFilter,
  ) {
    if (filters.locales.length === 0) {
      return await this.prisma.categoryTranslation.findMany({
        where: {
          categoryId: id,
        },
      });
    }

    const translations = await this.prisma.categoryTranslation.findMany({
      where: {
        categoryId: id,
        locale: {
          in: filters.locales,
        },
      },
    });

    return translations;
  }
}
