import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category, CategoryTranslation } from '@prisma/client';
import { DEFAULT_LANG } from 'src/config/variables';

@Injectable()
export class CategoriesService {
  private readonly CATEGORIES_CACHE_KEY = 'app:categories';
  private readonly DEFAULT_LANG = DEFAULT_LANG;
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryInput: CreateCategoryInput) {
    const { translations, ...newCategory } = createCategoryInput;

    // check if translations are valid and there are no duplicates
    const uniqueTranslations = new Map<string, (typeof translations)[number]>();
    for (const translation of translations) {
      if (uniqueTranslations.has(translation.localeCode)) {
        throw new Error(
          `Duplicate translation found for locale: ${translation.localeCode}`,
        );
      }
      uniqueTranslations.set(translation.localeCode, translation);
    }

    return this.prisma.category.create({
      data: {
        ...newCategory,
        CategoryTranslation: {
          create: Array.from(uniqueTranslations.values()).map((t) => ({
            name: t.name,
            description: t.description,
            locale: {
              connect: {
                code: t.localeCode,
              },
            },
          })),
        },
      },
    });
  }

  private getCategoryCacheKey(id: string): string {
    return `${this.CATEGORIES_CACHE_KEY}:${id}`;
  }

  async findAll(parentId?: string | null): Promise<Category[]> {
    if (parentId && parentId.trim() !== '') {
      const categories = await this.prisma.category.findMany({
        where: { parentCategoryId: parentId },
      });

      return categories;
    }

    const categories = await this.prisma.category.findMany({
      where: {
        parentCategoryId: null,
      },
    });

    return categories;
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    return category;
  }

  async update(id: string, updateCategoryInput: UpdateCategoryInput) {
    const currentCategory = await this.prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        parentCategoryId: true,
      },
    });

    if (!currentCategory) {
      throw new NotFoundException();
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        slug: updateCategoryInput.slug,
        parentCategoryId: updateCategoryInput.parentCategoryId,
      },
    });
  }

  async remove(id: string) {
    try {
      const res = await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `Failed to remove category with id ${id}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async findAllSubcategoriesByParentIds(
    parentIds: string[],
  ): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: {
        parentCategoryId: {
          in: parentIds,
        },
      },
    });
  }

  async getCategorySubcategoriesByBatch(
    parentIds: string[],
  ): Promise<(Category[] | null)[]> {
    const categories = await this.findAllSubcategoriesByParentIds(parentIds);
    return parentIds.map(
      (parentId) =>
        categories.filter(
          (category) => category.parentCategoryId === parentId,
        ) || null,
    );
  }

  async findTranslation(categoryId: string, locale: string) {
    return this.prisma.categoryTranslation.findFirst({
      where: {
        categoryId: categoryId,
        locale: {
          code: locale,
        },
      },
    });
  }

  /**
   * Metóda navrhnutá (najmä) pre data loader
   * source: @link https://blog.logrocket.com/use-dataloader-nestjs/#setting-up-nestjs-graphql
   * @param lang
   * @param categoryIds
   * @returns
   */
  async getAllTranslationsByBatch(
    lang: string,
    categoryIds: string[],
  ): Promise<(CategoryTranslation | null)[]> {
    const categoryTranslations = await this.prisma.categoryTranslation.findMany(
      {
        where: {
          categoryId: {
            in: categoryIds,
          },
          locale: {
            code: {
              in: [lang, DEFAULT_LANG],
            },
          },
        },
        include: {
          locale: {
            select: {
              code: true,
            },
          },
        },
      },
    );

    return categoryIds.map((id) => {
      const cts = categoryTranslations.filter((ct) => ct.categoryId === id);
      if (cts.length === 0) return null;
      return cts.find((ct) => ct.locale.code === lang) || cts[0];
    });
  }

  async findTranslations(id: string, locale?: string) {
    if (!locale) {
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
          code: {
            in: [locale, 'en'],
          },
        },
      },
      include: {
        locale: true,
      },
    });

    if (translations.length === 0) {
      throw new NotFoundException(
        `Translations not found for category with id ${id}`,
      );
    }

    return (
      translations.filter(
        (translation) => translation.locale.code === locale,
      ) ||
      translations.filter((translation) => translation.locale.code === 'en')
    );
  }
}
