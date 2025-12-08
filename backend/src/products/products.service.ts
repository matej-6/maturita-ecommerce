import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { LocalesService } from 'src/locales/locales.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import {
  ProductFindAllQueryArgs as ProductFindAllQueryArgs,
  ProductFindOneQueryArgs,
  ProductSortingArgs,
} from './products.resolver.args';
import { PaginatedProduct, Product } from './entities/product.entity';
import { PaginationArgs } from 'src/lib/pagination.args';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { ProductTranslation } from 'generated/prisma/client';
import { CreateProductTranslationInput } from './dto/create-product-translation.input';
import { EditProductTranslationInput } from './dto/edit-product-translation.input';

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

  async setProductImageThumbnail(productImageId: number) {
    const image = await this.prisma.productImage.findFirst({
      where: {
        id: productImageId,
      },
    });

    if (!image) {
      throw new BadRequestException('products.service.imageNotFound');
    }

    const updatedImage = await this.prisma.$transaction(async (tx) => {
      await tx.productImage.updateMany({
        where: {
          productId: image.productId,
        },
        data: {
          isThumbnail: false,
        },
      });

      return await tx.productImage.update({
        where: {
          id: productImageId,
        },
        data: {
          isThumbnail: true,
        },
      });
    });

    return updatedImage;
  }

  async addProductImage(productId: number, base64: string, mimeType: string) {
    if (!mimeType.startsWith('image/')) {
      throw new BadRequestException('products.service.invalidImageMimeType');
    }

    const [product, existingThumbnail] = await Promise.all([
      this.prisma.product.findFirst({
        where: {
          id: productId,
        },
        select: {
          id: true,
        },
      }),
      this.prisma.productImage.findFirst({
        where: {
          productId: productId,
          isThumbnail: true,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!product) {
      throw new BadRequestException(
        'products.service.addImage.productNotFound',
      );
    }

    const newImage = await this.prisma.productImage.create({
      data: {
        productId: productId,
        base64: base64,
        mimeType: mimeType,
        isThumbnail: existingThumbnail ? false : true,
      },
    });

    return newImage;
  }

  async editProductTranslation(
    input: EditProductTranslationInput,
  ): Promise<ProductTranslation> {
    const foundLocale = this.localesService.findOne(input.localeCode);
    if (!foundLocale) {
      throw new BadRequestException('products.service.invalidLocaleCode');
    }

    const foundTranslation = await this.prisma.productTranslation.findFirst({
      where: {
        id: input.productTranslationId,
      },
      select: {
        productId: true,
        id: true,
        locale: true,
      },
    });

    if (!foundTranslation) {
      throw new BadRequestException(
        'products.service.editTranslation.notFound',
      );
    }

    if (foundTranslation.locale !== input.localeCode) {
      const existingTranslation =
        await this.prisma.productTranslation.findFirst({
          where: {
            productId: foundTranslation.productId,
            locale: input.localeCode,
          },
          select: {
            id: true,
          },
        });

      if (existingTranslation) {
        throw new BadRequestException(
          'products.service.editTranslation.translationWithThisLocaleAlreadyExists',
        );
      }
    }

    const updatedTranslation = await this.prisma.productTranslation.update({
      where: {
        id: input.productTranslationId,
      },
      data: {
        description: input.description || null,
        name: input.name,
        locale: input.localeCode,
        markdownContent: input.markdownContent || null,
      },
    });

    return updatedTranslation;
  }

  private validatePaginationArgs(args: PaginationArgs) {
    if (args.cursor != null) {
      args.cursor = Math.abs(args.cursor);
    }
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
    queryArgs.categoryId =
      queryArgs.categoryId === null ? null : Math.abs(queryArgs.categoryId);
  }

  private validateSortingArgs(args: ProductSortingArgs) {
    const validSortByFields = [
      'createdAt',
      'updatedAt',
      'id',
      'categoryId',
      null,
    ];
    if (!validSortByFields.includes(args.sortBy)) {
      args.sortBy = null;
    }
  }

  getIsSetup(hasEnglishTranslation: boolean, variantsCounts: number) {
    return hasEnglishTranslation && variantsCounts > 0;
  }

  async findAll(
    paginationArgs: PaginationArgs,
    queryArgs: ProductFindAllQueryArgs,
    sortingArgs: ProductSortingArgs,
    role?: AuthenticatedUserDto['role'],
  ): Promise<PaginatedProduct> {
    this.validatePaginationArgs(paginationArgs);
    this.validateFindAllQueryArgs(queryArgs, role);
    this.validateSortingArgs(sortingArgs);

    if (queryArgs.isSetup == null) {
      const products = await this.prisma.product.findMany({
        where: {
          isPublic: queryArgs.isPublic == null ? undefined : queryArgs.isPublic,
          categoryId:
            queryArgs.categoryId == null
              ? undefined
              : queryArgs.categoryId === 0
                ? null
                : queryArgs.categoryId,
          slug:
            queryArgs.slug == null
              ? undefined
              : {
                  contains: queryArgs.slug,
                },
        },
        select: {
          id: true,
          isPublic: true,
          slug: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
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
          paginationArgs.cursor == null
            ? undefined
            : {
                id: paginationArgs.cursor,
              },
        take: paginationArgs.pageSize + 1,
        orderBy:
          sortingArgs.sortBy === null
            ? {
                id: sortingArgs.ascending === false ? 'desc' : 'asc',
              }
            : {
                [sortingArgs.sortBy]:
                  sortingArgs.ascending === false ? 'desc' : 'asc',
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
            isSetup: this.getIsSetup(
              p._count.ProductTranslations > 0,
              p._count.ProductVariants,
            ),
            categoryId: p.categoryId,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
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
                    : queryArgs.categoryId === 0
                      ? null
                      : queryArgs.categoryId,
                slug:
                  queryArgs.slug == null
                    ? undefined
                    : {
                        contains: queryArgs.slug,
                      },
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
                    : queryArgs.categoryId === 0
                      ? null
                      : queryArgs.categoryId,
                slug:
                  queryArgs.slug == null
                    ? undefined
                    : {
                        contains: queryArgs.slug,
                      },
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
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          },
        })),
      };
    }
  }

  /**
   * Metóda navrhnutá pre data loader
   * source: @link https://blog.logrocket.com/use-dataloader-nestjs/#setting-up-nestjs-graphql
   */
  async getAllTranslationsByBatch(
    lang: string,
    productIds: number[],
  ): Promise<(ProductTranslation | null)[]> {
    const productTranslations = await this.prisma.productTranslation.findMany({
      where: {
        productId: {
          in: productIds,
        },
        locale: {
          in: [lang, this.localesService.getDefaultLocale().code],
        },
      },
    });

    return productIds.map((id) => {
      const cts = productTranslations.filter((pt) => pt.productId === id);
      if (cts.length === 0) return null;
      return cts.find((ct) => ct.locale === lang) || cts[0];
    });
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
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) {
      this.logger.warn(
        `findOne(id=${queryArgs.id}, role?: ${role}) did not find any product`,
      );
      return null;
    }
    const isSetup = this.getIsSetup(
      product._count.ProductTranslations > 0,
      product._count.ProductVariants,
    );

    console.log('isSetup', isSetup, queryArgs.isSetup);
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
        createdAt: true,
        updatedAt: true,
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
      isSetup: this.getIsSetup(
        updatedProduct._count.ProductTranslations > 0,
        updatedProduct._count.ProductVariants,
      ),
    };
  }

  // otestovat este...
  async remove(id: number) {
    const deletedProductId = await this.prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({
        where: {
          OR: [{ productId: id }, { ProductVariant: { productId: id } }],
        },
      });

      await tx.attribute.deleteMany({
        where: {
          ProductVariants: {
            every: {
              productId: id,
            },
          },
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

  async getAllTranslationsForProductsByBatch(productIds: number[]) {
    const productTranslations = await this.prisma.productTranslation.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
    });

    return productIds.map((id) => {
      return productTranslations.filter((pt) => pt.productId === id);
    });
  }

  async getAllVariantsForProductsByBatch(productIds: number[]) {
    const productVariants = await this.prisma.productVariant.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
    });

    return productIds.map((id) => {
      return productVariants.filter((pv) => pv.productId === id);
    });
  }

  async getAllImagesForProductsByBatch(productIds: number[]) {
    const productImages = await this.prisma.productImage.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
    });

    return productIds.map((id) => {
      return productImages.filter((pi) => pi.productId === id);
    });
  }

  async deleteProductTranslation(
    productTranslationId: number,
  ): Promise<number> {
    await this.prisma.productTranslation.delete({
      where: {
        id: productTranslationId,
      },
    });

    return productTranslationId;
  }

  async createProductTranslation(
    productId: number,
    input: CreateProductTranslationInput,
  ): Promise<ProductTranslation> {
    const foundLocale = this.localesService.findOne(input.localeCode);
    if (!foundLocale) {
      throw new BadRequestException('products.service.invalidLocaleCode');
    }

    const [existingTranslation, existingProduct] = await Promise.all([
      this.prisma.productTranslation.findFirst({
        where: {
          productId: productId,
          locale: input.localeCode,
        },
        select: {
          id: true,
        },
      }),
      this.prisma.product.findFirst({
        where: {
          id: productId,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (existingTranslation) {
      throw new BadRequestException(
        'products.service.createTranslation.translationWithThisLocaleAlreadyExists',
      );
    }

    if (!existingProduct) {
      throw new BadRequestException(
        'products.service.createTranslation.productNotFound',
      );
    }

    const newTranslation = await this.prisma.productTranslation.create({
      data: {
        productId: productId,
        locale: input.localeCode,
        name: input.name,
        description: input.description || null,
        markdownContent: input.markdownContent || null,
      },
    });
    return newTranslation;
  }

  async deleteProductImage(productImageId: number): Promise<number> {
    const existingImage = await this.prisma.productImage.findFirst({
      where: {
        id: productImageId,
      },
      select: {
        id: true,
        isThumbnail: true,
        productId: true,
      },
    });

    if (!existingImage) {
      throw new BadRequestException('products.service.imageNotFound');
    }

    await this.prisma.productImage.delete({
      where: {
        id: productImageId,
      },
    });

    if (existingImage.isThumbnail) {
      const anotherImage = await this.prisma.productImage.findFirst({
        where: {
          productId: existingImage.productId,
        },
        select: {
          id: true,
        },
      });

      if (anotherImage) {
        await this.prisma.productImage.update({
          where: {
            id: anotherImage.id,
          },
          data: {
            isThumbnail: true,
          },
        });
      }
    }

    return productImageId;
  }
}
