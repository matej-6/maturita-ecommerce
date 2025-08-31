import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';
import { LocalesService } from 'src/locales/locales.service';

@Injectable()
export class CategoriesService {
  private readonly CATEGORIES_CACHE_KEY = 'app:categories';

  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly localeService: LocalesService,
  ) {}
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

  private async invalidateCategoriesCache(
    id: string,
    parentCategoryId: string | null,
  ) {
    const findAllCategoriesKey =
      this.CATEGORIES_CACHE_KEY +
      (parentCategoryId ? `:${parentCategoryId}` : '');
    await this.redisService.client.del(findAllCategoriesKey);
    await this.redisService.client.del(this.getCategoryCacheKey(id));
  }

  async findAll(parentId?: string): Promise<Category[]> {
    if (parentId && parentId.trim() !== '') {
      const cachedCategories = await this.redisService.client.get(
        this.getCategoryCacheKey(parentId),
      );

      if (cachedCategories) {
        try {
          return JSON.parse(cachedCategories) as Category[];
        } catch (error) {
          this.logger.error(
            `Failed to parse cached categories for parentId ${parentId}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }

      const categories = await this.prisma.category.findMany({
        where: { parentCategoryId: parentId },
      });
      await this.redisService.client.set(
        this.getCategoryCacheKey(parentId),
        JSON.stringify(categories),
        {
          expiration: {
            type: 'EX',
            value: 60 * 60 * 24,
          },
        },
      );
      return categories;
    }

    const cachedCategories = await this.redisService.client.get(
      this.CATEGORIES_CACHE_KEY,
    );
    if (cachedCategories) {
      try {
        return JSON.parse(cachedCategories) as Category[];
      } catch (error) {
        this.logger.error(
          `Failed to parse cached categories: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    const categories = await this.prisma.category.findMany();
    await this.redisService.client.set(
      this.CATEGORIES_CACHE_KEY,
      JSON.stringify(categories),
      {
        expiration: {
          type: 'EX',
          value: 60 * 60 * 24,
        },
      },
    );
    return categories;
  }

  async findOne(id: string) {
    const cachedCategory = await this.redisService.client.get(
      this.getCategoryCacheKey(id),
    );

    if (cachedCategory) {
      try {
        return JSON.parse(cachedCategory) as Category;
      } catch (error) {
        this.logger.error(
          `Failed to parse cached category for id ${id}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (category) {
      await this.redisService.client.set(
        this.getCategoryCacheKey(id),
        JSON.stringify(category),
        {
          expiration: {
            type: 'EX',
            value: 60 * 60 * 24,
          },
        },
      );
    }

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
      throw new NotFoundException('Category not found');
    }

    await this.invalidateCategoriesCache(id, currentCategory.parentCategoryId);

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

      await this.invalidateCategoriesCache(res.id, res.parentCategoryId);
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
