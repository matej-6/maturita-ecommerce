import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category, CategoryTranslation } from 'generated/prisma/client';
import { LocalesService } from 'src/locales/locales.service';
import { DEFAULT_LOCALE } from 'src/locales';

@Injectable()
export class CategoriesService {
  private readonly CATEGORIES_CACHE_KEY = 'app:categories';
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localesService: LocalesService,
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
      throw new BadRequestException();
    }

    return this.prisma.category.create({
      data: {
        ...createCategoryInput,
      },
    });
  }

  private getCategoryCacheKey(id: string): string {
    return `${this.CATEGORIES_CACHE_KEY}:${id}`;
  }

  async findAll(parentId?: string): Promise<Category[]> {
    if (!parentId && parentId !== '') {
      return await this.prisma.category.findMany({});
    }
    if (parentId === '') {
      const categories = await this.prisma.category.findMany({
        where: { parentCategoryId: null },
      });

      return categories;
    }

    const categories = await this.prisma.category.findMany({
      where: {
        parentCategoryId: parentId,
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
      await this.prisma.$transaction(async (tx) => {
        // 1. odstranit vsetky translations
        await tx.categoryTranslation.deleteMany({
          where: {
            categoryId: id,
          },
        });

        // 2. odstranit categry
        await tx.category.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.logger.error(
        `Failed to remove category with id ${id}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new Error(error);
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
    categoryIds: string[],
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

  async findTranslations(id: string, locales?: string[]) {
    if (!locales || locales.length === 0) {
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
          in: locales,
        },
      },
    });

    if (translations.length === 0) {
      throw new NotFoundException(
        `Translations not found for category with id ${id}`,
      );
    }

    return translations;
  }
}
