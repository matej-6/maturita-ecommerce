import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category, CategoryTranslation } from 'generated/prisma/client';
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
      throw new BadRequestException('categories.service.slugAlreadyInUse');
    }

    return this.prisma.category.create({
      data: {
        ...createCategoryInput,
      },
    });
  }

  async createTranslation(
    categoryId: string,
    input: CreateCategoryTranslationInput,
  ) {
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
    await this.updateIsSetup(res.id);

    return res;
  }

  async editTranslation(
    translationId: string,
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

    await this.updateIsSetup(res.categoryId);

    return res;
  }

  async removeTranslation(id: string) {
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

      await this.updateIsSetup(translation.categoryId);

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

  private async updateIsSetup(id: string) {
    const c = await this.prisma.category.findFirst({
      where: {
        id: id,
      },
      select: {
        CategoryTranslation: {
          select: {
            locale: true,
          },
        },
      },
    });

    if (c !== null) {
      const isSetup = c.CategoryTranslation.some(
        (t) => t.locale === this.localesService.locales().english.code,
      );
      await this.prisma.category.update({
        where: {
          id: id,
        },
        data: {
          isSetup: isSetup,
        },
      });

      return isSetup;
    }

    return null;
  }

  private getCategoryCacheKey(id: string): string {
    return `${this.CATEGORIES_CACHE_KEY}:${id}`;
  }

  async findAll(filter: CategoriesServiceFindAllFilter): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where: {
        parentCategoryId:
          filter.parentCategoryId === '*' ? undefined : filter.parentCategoryId,
        isSetup: filter.isSetup == null ? undefined : filter.isSetup,
        isPublic: filter.isPublic == null ? undefined : filter.isPublic,
      },
    });
  }

  async findOne(id: string, filter: CategoriesServiceFindOneFilter) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: id,
        isSetup: filter.isSetup == null ? undefined : filter.isSetup,
        isPublic: filter.isPublic == null ? undefined : filter.isPublic,
      },
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

    if (updateCategoryInput.parentCategoryId != null) {
      const categorySubcategoriesMap = new Map<string, Set<string>>();
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
      throw new InternalServerErrorException();
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

  async findTranslations(
    id: string,
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
