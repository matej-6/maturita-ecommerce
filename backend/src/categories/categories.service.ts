import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Category as DbCategory,
  CategoryTranslation,
} from 'generated/prisma/client';
import { LocalesService } from 'src/locales/locales.service';
import { CreateCategoryTranslationInput } from './dto/create-category-translation.input';
import { EditCategoryTranslationInput } from './dto/edit-category-translation.input';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import { ProductsService } from 'src/products/products.service';
import { Category, PaginatedCategory } from './entities/category.entity';
import {
  CategoryFindAllQueryFilterArgs,
  CategoryFindOneQueryFilterArgs,
  CategorySortByArgs,
  CategoryTranslationsQueryFilterArgs,
} from './categories.resolver.args';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { PaginationArgs } from 'src/lib/pagination.args';
import { ERROR } from 'src/errors';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localesService: LocalesService,
    private readonly productsService: ProductsService,
  ) {}
  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
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

    const category = await this.prisma.category.create({
      data: {
        ...createCategoryInput,
      },
    });

    return {
      ...category,
      isSetup: (await this.isSetupByIds(category.id))[0],
    };
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

  private validateFindAllArgs(
    args: CategoryFindAllQueryFilterArgs,
    role?: AuthenticatedUserDto['role'],
  ): void {
    args.isPublic = role === 'ADMIN' ? args.isPublic : true;
    args.isSetup = role === 'ADMIN' ? args.isSetup : true;
    if (args.parentCategoryId !== null && args.parentCategoryId < 0) {
      args.parentCategoryId = null;
    }
  }

  private validateSortingArgs(args: CategorySortByArgs): void {
    const validSortFields = [
      'createdAt',
      'updatedAt',
      'slug',
      'id',
      'productsCount',
      null,
    ];
    if (
      args.sortBy == null ||
      !validSortFields.includes(args.sortBy) ||
      (args.sortBy != null && args.ascending == null)
    ) {
      args.sortBy = null;
      args.ascending = null;
    }
  }

  async findAll(
    filterArgs: CategoryFindAllQueryFilterArgs,
    sortingArgs: CategorySortByArgs,
    userRole?: AuthenticatedUserDto['role'],
  ): Promise<Category[]> {
    this.validateFindAllArgs(filterArgs, userRole);
    this.validateSortingArgs(sortingArgs);
    const categories = await this.prisma.category.findMany({
      where: {
        parentCategoryId:
          filterArgs.parentCategoryId === 0
            ? undefined
            : filterArgs.parentCategoryId,
        isPublic: filterArgs.isPublic == null ? undefined : filterArgs.isPublic,
      },
      orderBy:
        sortingArgs.sortBy !== null
          ? {
              [sortingArgs.sortBy]: sortingArgs.ascending ? 'asc' : 'desc',
            }
          : undefined,
    });

    const categoriesWithIsSetup = await this.isSetupByIds(
      ...categories.map((c) => c.id),
    );

    return categories
      .map((category, index) => ({
        ...category,
        isSetup: categoriesWithIsSetup[index],
      }))
      .filter(
        (category) =>
          filterArgs.isSetup == null || category.isSetup === filterArgs.isSetup,
      );
  }

  private validatePaginationArgs(args: PaginationArgs) {
    if (args.cursor != null) {
      args.cursor = Math.abs(args.cursor);
    }
    args.pageSize = Math.min(Math.abs(args.pageSize), 25);
  }

  async findPaginated(
    filterArgs: CategoryFindAllQueryFilterArgs,
    sortingArgs: CategorySortByArgs,
    paginationArgs: PaginationArgs,
    userRole?: AuthenticatedUserDto['role'],
  ): Promise<PaginatedCategory> {
    this.validateFindAllArgs(filterArgs, userRole);
    this.validateSortingArgs(sortingArgs);
    this.validatePaginationArgs(paginationArgs);

    if (filterArgs.isSetup == null) {
      const categories = await this.prisma.category.findMany({
        where: {
          parentCategoryId:
            filterArgs.parentCategoryId === 0
              ? undefined
              : filterArgs.parentCategoryId,
          isPublic:
            filterArgs.isPublic == null ? undefined : filterArgs.isPublic,
          id: filterArgs.idQuery != null ? filterArgs.idQuery : undefined,
          slug:
            filterArgs.slugQuery != null
              ? { contains: filterArgs.slugQuery }
              : undefined,
        },
        orderBy:
          sortingArgs.sortBy !== null
            ? sortingArgs.sortBy !== 'productsCount'
              ? {
                  [sortingArgs.sortBy]: sortingArgs.ascending ? 'asc' : 'desc',
                }
              : {
                  Products: {
                    _count: sortingArgs.ascending ? 'asc' : 'desc',
                  },
                }
            : undefined,
        cursor:
          paginationArgs.cursor != null
            ? {
                id: paginationArgs.cursor,
              }
            : undefined,
        take: paginationArgs.pageSize + 1,
      });

      const hasNextPage = categories.length > paginationArgs.pageSize;
      const nextCursor = hasNextPage ? categories.pop()!.id : null;

      const categoryIdToIsSetup = await this.isSetupByIds(
        ...categories.map((c) => c.id),
      );

      const categoriesWithIsSetup = categories.map((category, index) => ({
        ...category,
        isSetup: categoryIdToIsSetup[index],
      }));

      return {
        nextCursor,
        totalCount: categories.length,
        edges: categoriesWithIsSetup.map((c) => ({
          cursor: c.id,
          node: c,
        })),
      };
    } else {
      const categories = filterArgs.isSetup
        ? await this.prisma.category.findMany({
            where: {
              parentCategoryId:
                filterArgs.parentCategoryId === 0
                  ? undefined
                  : filterArgs.parentCategoryId,
              isPublic:
                filterArgs.isPublic == null ? undefined : filterArgs.isPublic,
              CategoryTranslation: {
                some: {
                  locale: {
                    equals: this.localesService.getDefaultLocale().code,
                  },
                },
              },
            },
            orderBy:
              sortingArgs.sortBy !== null
                ? {
                    [sortingArgs.sortBy]: sortingArgs.ascending
                      ? 'asc'
                      : 'desc',
                  }
                : undefined,
            cursor:
              paginationArgs.cursor != null
                ? {
                    id: paginationArgs.cursor,
                  }
                : undefined,
            take: paginationArgs.pageSize + 1,
            select: {
              id: true,
              isPublic: true,
              slug: true,
              parentCategoryId: true,
              updatedAt: true,
              createdAt: true,
              _count: {
                select: {
                  CategoryTranslation: {
                    where: {
                      locale: {
                        equals: this.localesService.getDefaultLocale().code,
                      },
                    },
                  },
                },
              },
            },
          })
        : await this.prisma.category.findMany({
            where: {
              parentCategoryId:
                filterArgs.parentCategoryId === 0
                  ? undefined
                  : filterArgs.parentCategoryId,
              isPublic:
                filterArgs.isPublic == null ? undefined : filterArgs.isPublic,
              CategoryTranslation: {
                none: {
                  locale: {
                    equals: this.localesService.getDefaultLocale().code,
                  },
                },
              },
            },
            orderBy:
              sortingArgs.sortBy !== null
                ? {
                    [sortingArgs.sortBy]: sortingArgs.ascending
                      ? 'asc'
                      : 'desc',
                  }
                : undefined,
            cursor:
              paginationArgs.cursor != null
                ? {
                    id: paginationArgs.cursor,
                  }
                : undefined,
            take: paginationArgs.pageSize + 1,
            select: {
              id: true,
              isPublic: true,
              slug: true,
              parentCategoryId: true,
              updatedAt: true,
              createdAt: true,
              _count: {
                select: {
                  CategoryTranslation: {
                    where: {
                      locale: {
                        equals: this.localesService.getDefaultLocale().code,
                      },
                    },
                  },
                },
              },
            },
          });

      const hasNextPage = categories.length > paginationArgs.pageSize;
      const nextCursor = hasNextPage ? categories.pop()!.id : null;
      return {
        nextCursor,
        totalCount: categories.length,
        edges: categories.map((c) => ({
          cursor: c.id,
          node: {
            ...c,
            isSetup: c._count.CategoryTranslation > 0,
          },
        })),
      };
    }
  }

  private validateFindOneArgs(
    args: CategoryFindOneQueryFilterArgs,
    role?: AuthenticatedUserDto['role'],
  ): void {
    args.isPublic = role === 'ADMIN' ? args.isPublic : true;
    args.isSetup = role === 'ADMIN' ? args.isSetup : true;
  }

  async findOne(
    id: number | null,
    slug: string | null,
    filterArgs: CategoryFindOneQueryFilterArgs,
    role?: AuthenticatedUserDto['role'],
  ): Promise<Category | null> {
    this.validateFindOneArgs(filterArgs, role);
    const category = await this.prisma.category.findFirst({
      where: {
        id: id == null ? undefined : id,
        slug: slug == null ? undefined : slug,
        isPublic: filterArgs.isPublic == null ? undefined : filterArgs.isPublic,
      },
      select: {
        id: true,
        slug: true,
        parentCategoryId: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!category) return null;

    const isSetup = (await this.isSetupByIds(category.id))[0];

    if (filterArgs.isSetup != null && filterArgs.isSetup !== isSetup) {
      return null;
    }

    return {
      ...category,
      isSetup: isSetup,
    };
  }

  private async isSetupByIds(...categoryIds: number[]) {
    const categoriesWithTranslations = await this.prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
      select: {
        id: true,
        _count: {
          select: {
            CategoryTranslation: {
              where: {
                locale: {
                  equals: this.localesService.getDefaultLocale().code,
                },
              },
            },
          },
        },
      },
    });

    return categoryIds.map((categoryId) => {
      const category = categoriesWithTranslations.find(
        (c) => c.id === categoryId,
      );
      return category ? category._count.CategoryTranslation > 0 : false;
    });
  }

  async update(
    id: number,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    const currentCategory = await this.prisma.category.findFirst({
      where: { id },
      select: {
        id: true,
        parentCategoryId: true,
        slug: true,
      },
    });

    if (!currentCategory) {
      throw new BadRequestException(
        'categories.service.update.categoryNotFound',
      );
    }

    if (updateCategoryInput.slug !== currentCategory.slug) {
      const countCategoriesWithNewSlug = await this.prisma.category.count({
        where: {
          slug: updateCategoryInput.slug,
        },
      });

      if (countCategoriesWithNewSlug > 0) {
        throw new BadRequestException('categories.service.slugAlreadyInUse');
      }
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
          this.logger.fatal(`Category ${cid} is part of cycle`);
          continue;
        }
        seen.add(cid);
        const subcategories = categorySubcategoriesMap.get(cid);
        for (const sub of subcategories ?? []) {
          if (sub === updateCategoryInput.parentCategoryId) {
            throw new BadRequestException(
              'categories.service.update.cycleDetected',
            );
          }
          queue.push(sub);
        }
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        slug: updateCategoryInput.slug,
        parentCategoryId: updateCategoryInput.parentCategoryId,
        isPublic: updateCategoryInput.isPublic,
      },
    });

    return {
      ...updatedCategory,
      isSetup: (await this.isSetupByIds(updatedCategory.id))[0],
    };
  }

  async remove(id: number) {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `Failed to remove category with id ${id}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new InternalServerErrorException(ERROR.unknownError);
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
  ): Promise<(Category[] | null)[]> {
    const subcategories = await this.findAllSubcategoriesByParentIds(parentIds);

    const isSetupZoznam = await this.isSetupByIds(
      ...subcategories.map((c) => c.id),
    );

    const subcategoriesWithIsSetup = subcategories.map(
      (subcategory, index) => ({
        ...subcategory,
        isSetup: isSetupZoznam[index],
      }),
    );

    return parentIds.map(
      (parentId) =>
        subcategoriesWithIsSetup.filter(
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
   * source https://blog.logrocket.com/use-dataloader-nestjs/#setting-up-nestjs-graphql
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
            in: [lang, this.localesService.getDefaultLocale().code],
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

  private validateTranslationsQueryFilterArgs(
    args: CategoryTranslationsQueryFilterArgs,
  ): void {
    args.locales = args.locales.filter(
      (locale) => !!this.localesService.findOne(locale.trim().toLowerCase()),
    );
  }

  async findTranslations(
    id: number,
    filterArgs: CategoryTranslationsQueryFilterArgs,
  ) {
    this.validateTranslationsQueryFilterArgs(filterArgs);
    if (filterArgs.locales.length === 0) {
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
          in: filterArgs.locales,
        },
      },
    });

    return translations;
  }
}
