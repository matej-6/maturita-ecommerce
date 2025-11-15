import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { LocalesService } from 'src/locales/locales.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import {
  ProductFindAllQueryArgs as ProductFindAllQueryArgs,
  ProductFindOneQueryArgs,
} from './products.resolver.args';
import { PaginatedProduct, Product } from './entities/product.entity';
import { PaginationArgs } from 'src/lib/pagination.args';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localesService: LocalesService,
  ) {}

  async create(input: CreateProductInput) {
    input.slug = input.slug.trim().toLowerCase();
    this.logger.log(`creating prdouct with input: ${JSON.stringify(input)}`);

    try {
      const product = await this.prisma.product.create({
        data: {
          slug: input.slug,
          categoryId: input.categoryId,
          isPublic: input.isPublic,
        },
      });

      this.logger.log(`successfully created new product with id ${product.id}`);

      return product;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        // https://www.prisma.io/docs/orm/reference/error-reference#p2002
        if (e.code === 'P2002') {
          throw new BadRequestException('products.service.slugAlreadyInUse');
        }
      }
      throw e;
    }
  }

  private validatePaginationArgs(args: PaginationArgs) {
    args.cursor = Math.abs(args.cursor);
    args.pageSize = Math.min(Math.abs(args.pageSize), 25);
  }

  private validateFindOneQueryArgs(
    queryArgs: ProductFindOneQueryArgs,
    role?: AuthenticatedUserDto['role'],
  ) {
    queryArgs.isPublic = role === 'ADMIN' ? queryArgs.isPublic : true;
    queryArgs.isSetup = role === 'ADMIN' ? queryArgs.isSetup : true;
  }

  private validateFindAllQueryArgs(
    queryArgs: ProductFindAllQueryArgs,
    role?: AuthenticatedUserDto['role'],
  ) {
    queryArgs.isPublic = role === 'ADMIN' ? queryArgs.isPublic : true;
    queryArgs.isSetup = role === 'ADMIN' ? queryArgs.isSetup : true;
  }

  private getIsSetup(product: {
    _count: {
      ProductTranslations: number;
      ProductVariants: number;
    };
  }) {
    return (
      product._count.ProductTranslations > 0 &&
      product._count.ProductVariants > 0
    );
  }

  async findAll(
    paginationArgs: PaginationArgs,
    queryArgs: ProductFindAllQueryArgs,
    role?: AuthenticatedUserDto['role'],
  ): Promise<PaginatedProduct> {
    this.validatePaginationArgs(paginationArgs);
    this.validateFindAllQueryArgs(queryArgs, role);

    if (queryArgs.isSetup == null) {
      const products = await this.prisma.product.findMany({
        where: {
          isPublic: queryArgs.isPublic == null ? undefined : queryArgs.isPublic,
          categoryId:
            queryArgs.categoryId == null ? undefined : queryArgs.categoryId,
        },
        select: {
          id: true,
          isPublic: true,
          slug: true,
          categoryId: true,
          _count: {
            select: {
              ProductTranslations: {
                where: {
                  locale: {
                    equals: this.localesService.locales().english.code,
                  },
                },
              },
              ProductVariants: true,
            },
          },
        },
        cursor:
          paginationArgs.cursor === 0
            ? undefined
            : {
                id: paginationArgs.cursor,
              },
        take: paginationArgs.pageSize + 1,
        orderBy: {
          id: 'asc',
        },
      });
      const hasNextPage = products.length === paginationArgs.pageSize + 1;
      if (hasNextPage) {
        products.pop();
      }

      return {
        hasNextPage: hasNextPage,
        totalCount: products.length,
        edges: products.map((p) => ({
          cursor: p.id,
          node: {
            id: p.id,
            isPublic: p.isPublic,
            slug: p.slug,
            isSetup: this.getIsSetup(p),
            categoryId: p.categoryId,
          },
        })),
      };
    } else {
      const products =
        queryArgs.isSetup === true
          ? await this.prisma.product.findMany({
              where: {
                isPublic:
                  queryArgs.isPublic == null ? undefined : queryArgs.isPublic,
                categoryId:
                  queryArgs.categoryId == null
                    ? undefined
                    : queryArgs.categoryId,
                ProductTranslations: {
                  some: {
                    locale: {
                      equals: this.localesService.locales().english.code,
                    },
                  },
                },
                ProductVariants: {
                  some: {
                    id: {
                      gt: 0,
                    },
                  },
                },
              },
            })
          : await this.prisma.product.findMany({
              where: {
                isPublic:
                  queryArgs.isPublic == null ? undefined : queryArgs.isPublic,
                categoryId:
                  queryArgs.categoryId == null
                    ? undefined
                    : queryArgs.categoryId,
                ProductTranslations: {
                  none: {
                    locale: {
                      equals: this.localesService.locales().english.code,
                    },
                  },
                },
                ProductVariants: {
                  none: {
                    id: {
                      gt: 0,
                    },
                  },
                },
              },
            });

      const hasNextPage = products.length === paginationArgs.pageSize + 1;
      if (hasNextPage) {
        products.pop();
      }

      return {
        hasNextPage: hasNextPage,
        totalCount: products.length,
        edges: products.map((p) => ({
          cursor: p.id,
          node: {
            id: p.id,
            isPublic: p.isPublic,
            slug: p.slug,
            categoryId: p.categoryId,
            isSetup: queryArgs.isSetup!,
          },
        })),
      };
    }
  }

  async findOne(
    queryArgs: ProductFindOneQueryArgs,
    role?: AuthenticatedUserDto['role'],
  ): Promise<Product | null> {
    this.validateFindOneQueryArgs(queryArgs, role);
    const product = await this.prisma.product.findFirst({
      where: {
        id: queryArgs.id,
        isPublic: queryArgs.isPublic == null ? undefined : queryArgs.isPublic,
      },
      select: {
        _count: {
          select: {
            ProductTranslations: {
              where: {
                locale: this.localesService.locales().english.code,
              },
            },
            ProductVariants: true,
          },
        },
        id: true,
        isPublic: true,
        slug: true,
        categoryId: true,
      },
    });

    if (!product) {
      this.logger.warn(
        `findOne(id=${queryArgs.id}, role?: ${role}) did not find any product`,
      );
      return null;
    }
    const isSetup = this.getIsSetup(product);

    if (queryArgs.isSetup != null && queryArgs.isSetup !== isSetup) {
      this.logger.warn(
        `findOne(id=${queryArgs.id}, role?: ${role}) found product but isSetup does not match the queryArgs`,
      );
      return null;
    }

    return {
      ...product,
      isSetup: isSetup,
    };
  }

  async removeCategoryFromProducts(categoryId: number) {
    await this.prisma.product.updateMany({
      where: {
        categoryId: categoryId,
      },
      data: {
        categoryId: null,
      },
    });
  }

  async update(id: number, input: UpdateProductInput): Promise<Product> {
    input.slug = input.slug.trim().toLowerCase();

    const existingCategory = await this.prisma.product.count({
      where: {
        id: id,
      },
    });

    if (existingCategory === 0) {
      throw new BadRequestException('products.service.update.notFound');
    }

    const countProductWithSameSlug = await this.prisma.product.count({
      where: {
        slug: {
          equals: input.slug,
        },
      },
    });

    if (countProductWithSameSlug > 0) {
      throw new BadRequestException('products.service.slugAlreadyInUse');
    }

    const updatedProduct = await this.prisma.product.update({
      where: {
        id: id,
      },
      data: {
        categoryId: input.categoryId || null,
        isPublic: input.isPublic,
        slug: input.slug,
      },
      select: {
        id: true,
        isPublic: true,
        slug: true,
        categoryId: true,
        _count: {
          select: {
            ProductTranslations: {
              where: {
                locale: {
                  equals: this.localesService.locales().english.code,
                },
              },
            },
            ProductVariants: true,
          },
        },
      },
    });

    return {
      ...updatedProduct,
      isSetup: this.getIsSetup(updatedProduct),
    };
  }

  async remove(id: number) {
    const deletedProductId = await this.prisma.$transaction(async (tx) => {
      const attributes = await tx.attribute.findMany({
        where: {
          ProductVariant: {
            productId: id,
          },
        },
      });

      await Promise.all(
        attributes.map((attribute) =>
          tx.attributeTranslation.deleteMany({
            where: {
              attributeId: attribute.id,
            },
          }),
        ),
      );

      await tx.attribute.deleteMany({
        where: {
          ProductVariant: {
            productId: id,
          },
        },
      });

      await tx.productImage.deleteMany({
        where: {
          OR: [{ productId: id }, { ProductVariant: { productId: id } }],
        },
      });

      await tx.productVariant.deleteMany({
        where: {
          productId: id,
        },
      });

      await tx.productTranslation.deleteMany({
        where: {
          productId: id,
        },
      });

      const deletedProduct = await tx.product.delete({
        where: {
          id: id,
        },
        select: {
          id: true,
        },
      });

      return deletedProduct.id;
    });
    return deletedProductId;
  }
}
