import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductVariantInput } from './dto/create-product-variant.input';
import { UpdateProductVariantInput } from './dto/update-product-variant.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocalesService } from 'src/locales/locales.service';
import { ProductVariantImage } from 'src/entities/product-variant.image.entity';
import { PaginationArgs } from 'src/lib/pagination.args';
import {
  PaginatedProductVariant,
  ProductVariant,
} from './entities/product-variant.entity';
import { ProductFindAllQueryArgs } from 'src/products/products.resolver.args';
import { SortingArgs } from 'src/args/sorting-args';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { ImageStorageService } from 'src/image-storage/image-storage.service';

@Injectable()
export class ProductVariantsService {
  private readonly logger = new Logger(ProductVariantsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localesService: LocalesService,
    private readonly imageStorageService: ImageStorageService,
  ) {}

  async findOne(
    productVariantId: number,
    isPublic: boolean,
  ): Promise<ProductVariant | null> {
    const productVariant = await this.prisma.productVariant.findUnique({
      where: { id: productVariantId, isPublic: isPublic },
    });

    if (!productVariant) {
      return null;
    }

    return {
      id: productVariant.id,
      isPublic: productVariant.isPublic,
      priceInCents: productVariant.priceInCents,
      productId: productVariant.productId,
      sku: productVariant.sku,
      stock: productVariant.stock,
      createdAt: productVariant.createdAt,
      updatedAt: productVariant.updatedAt,
    };
  }

  async create(createProductVariantInput: CreateProductVariantInput) {
    const attributes = await this.prisma.$transaction(async (tx) => {
      const attrs = [];
      for (const attrId of createProductVariantInput.attributes) {
        const attribute = await tx.attribute.findUnique({
          where: { id: attrId },
        });
        if (!attribute) {
          throw new BadRequestException(
            'product-variants.service.create.attributeNotFound',
          );
        }
        attrs.push(attribute);
      }
      const prod = await tx.product.findUnique({
        where: { id: createProductVariantInput.productId },
      });
      if (!prod) {
        this.logger.error(
          `Product not found with ID: ${createProductVariantInput.productId}`,
        );
        throw new BadRequestException(
          'product-variants.service.create.productNotFound',
        );
      }
      return attrs;
    });

    return this.prisma.productVariant.create({
      data: {
        sku: createProductVariantInput.sku,
        priceInCents: createProductVariantInput.priceInCents,
        productId: createProductVariantInput.productId,
        Attributes: {
          connect: attributes.map((attr) => ({ id: attr.id })),
        },
        isPublic: createProductVariantInput.isPublic,
        stock: createProductVariantInput.stock,
      },
    });
  }

  async update(updateProductVariantInput: UpdateProductVariantInput) {
    return await this.prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({
        where: { id: updateProductVariantInput.id },
        select: {
          Attributes: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!variant) {
        throw new BadRequestException(
          'product-variants.service.update.productVariantNotFound',
        );
      }

      const attrs = [];
      if (updateProductVariantInput.attributes) {
        for (const attrId of updateProductVariantInput.attributes) {
          const attribute = await tx.attribute.findUnique({
            where: { id: attrId },
          });
          if (!attribute) {
            throw new BadRequestException(
              'product-variants.service.update.attributeNotFound',
            );
          }
          attrs.push(attribute);
        }
      }

      const newAttributes = updateProductVariantInput.attributes?.filter(
        (id) => !variant.Attributes.some((a) => a.id === id),
      );
      const removedAttributes = variant.Attributes.filter(
        (a) =>
          !updateProductVariantInput.attributes ||
          !updateProductVariantInput.attributes.includes(a.id),
      ).map((a) => a.id);

      const updatedVariant = await tx.productVariant.update({
        where: {
          id: updateProductVariantInput.id,
        },
        data: {
          sku: updateProductVariantInput.sku,
          priceInCents: updateProductVariantInput.priceInCents,
          isPublic: updateProductVariantInput.isPublic,
          stock: updateProductVariantInput.stock,
          ...(newAttributes && newAttributes.length > 0
            ? {
                Attributes: {
                  connect: newAttributes.map((id) => ({ id })),
                },
              }
            : {}),
          ...(removedAttributes.length > 0
            ? {
                Attributes: {
                  disconnect: removedAttributes.map((id) => ({ id })),
                },
              }
            : {}),
        },
      });

      return updatedVariant;
    });
  }

  async remove(id: number) {
    const exists = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new BadRequestException(
        'product-variants.service.remove.productVariantNotFound',
      );
    }

    const images = await this.prisma.productVariantImage.findMany({
      where: {
        productVariantId: id,
      },
    });

    for (const image of images) {
      try {
        await this.removeImage(image.id);
      } catch (e) {
        this.logger.error('Error removing image', e);
      }
    }

    const deleted = await this.prisma.productVariant.delete({
      where: { id },
    });
    return deleted.id;
  }

  async addImage(
    productVariantId: number,
    file: {
      buffer: Buffer;
      mimeType: string;
    },
  ): Promise<ProductVariantImage> {
    const [productVariant, foundThumbnailImage] =
      await this.prisma.$transaction(async (tx) => {
        const pv = await tx.productVariant.findUnique({
          where: { id: productVariantId },
          select: {
            id: true,
          },
        });

        const thumbnailImage = await tx.productVariantImage.findFirst({
          where: {
            productVariantId: productVariantId,
            isThumbnail: true,
          },
          select: {
            id: true,
          },
        });

        return [pv, thumbnailImage];
      });

    if (!productVariant) {
      throw new BadRequestException(
        'product-variants.service.addImage.productVariantNotFound',
      );
    }
    const isThumbnail = !foundThumbnailImage;

    const imageFileName = this.imageStorageService.getImageFileName(file);
    await this.imageStorageService.saveImageFile(imageFileName, file.buffer);

    const created = await this.prisma.productVariantImage.create({
      data: {
        isThumbnail,
        productVariantId: productVariant.id,
        fileName: imageFileName,
      },
    });

    return {
      ...created,
      productVariantId: created.productVariantId!,
      url: this.getImageUrl(created.fileName),
    };
  }

  getImageUrl(imageFileName: string) {
    return this.imageStorageService.getImageUrl(imageFileName);
  }

  async removeImage(id: number): Promise<number> {
    const [imageToDelete, nextThumbnailImage] = await this.prisma.$transaction(
      async (tx) => {
        const image = await tx.productVariantImage.findUnique({
          where: { id },
        });

        if (!image) {
          return [null, null];
        }
        let nextThumbnail = null;
        if (image.isThumbnail) {
          nextThumbnail = await tx.productVariantImage.findFirst({
            where: {
              productVariantId: image.productVariantId,
              id: {
                not: id,
              },
            },
            orderBy: {
              id: 'asc',
            },
          });
        }
        return [image, nextThumbnail];
      },
    );

    if (!imageToDelete) {
      throw new BadRequestException('product-variants.service.imageNotFound');
    }

    await this.imageStorageService.deleteImage(imageToDelete.fileName);

    await this.prisma.productVariantImage.delete({
      where: { id: imageToDelete.id },
    });

    if (nextThumbnailImage) {
      await this.prisma.productVariantImage.update({
        where: {
          id: nextThumbnailImage.id,
        },
        data: {
          isThumbnail: true,
        },
      });
    }

    return imageToDelete.productVariantId!;
  }

  async setThumbnailImage(id: number): Promise<ProductVariantImage> {
    const image = await this.prisma.productVariantImage.findUnique({
      where: { id },
    });

    if (!image) {
      throw new BadRequestException('product-variants.service.imageNotFound');
    }

    const updatedImage = await this.prisma.$transaction(async (tx) => {
      await tx.productVariantImage.updateMany({
        where: {
          productVariantId: image.productVariantId,
          isThumbnail: true,
        },
        data: {
          isThumbnail: false,
        },
      });

      return tx.productVariantImage.update({
        where: { id },
        data: {
          isThumbnail: true,
        },
      });
    });

    return {
      ...updatedImage,
      productVariantId: updatedImage.productVariantId!,
      url: this.getImageUrl(updatedImage.fileName),
    };
  }

  private validatePaginationArgs(args: PaginationArgs) {
    if (args.cursor != null) {
      args.cursor = Math.abs(args.cursor);
    }
    args.pageSize = Math.min(Math.abs(args.pageSize), 25);
  }

  private async extractAttributeFilters(args: string[][]) {
    const validFilterKeys = (
      await this.prisma.attributeKey.findMany({
        select: {
          key: true,
        },
      })
    ).map((ak) => ak.key);

    const res: Record<string, string[]> = {};

    for (const [key, value] of args) {
      if (!validFilterKeys.includes(key)) {
        continue;
      }
      if (!res[key]) {
        res[key] = [];
      }
      res[key].push(value);
    }
    return res;
  }

  private validateProductFindAllQueryArgs(
    queryArgs: ProductFindAllQueryArgs,
    role?: AuthenticatedUserDto['role'],
  ) {
    queryArgs.isPublic = role === 'ADMIN' ? queryArgs.isPublic : true;
    queryArgs.isSetup = role === 'ADMIN' ? queryArgs.isSetup : true;
    queryArgs.categoryId =
      queryArgs.categoryId === null ? null : Math.abs(queryArgs.categoryId);
  }

  private validateSortingArgs(args: SortingArgs) {
    const validSortByFields = ['priceInCents', null];
    if (!validSortByFields.includes(args.sortBy)) {
      args.sortBy = null;
    }
  }

  async searchProductVariants(
    searchTerm: string | null,
    paginationArgs: PaginationArgs,
    sortingArgs: SortingArgs,
    attributeFilters?: string[][],
  ): Promise<PaginatedProductVariant> {
    this.validatePaginationArgs(paginationArgs);
    this.validateSortingArgs(sortingArgs);
    const filters = attributeFilters
      ? await this.extractAttributeFilters(attributeFilters)
      : {};

    const productVariants = await this.prisma.productVariant.findMany({
      where: {
        Product: {
          isPublic: true,
          ProductTranslations: {
            some: {
              locale: {
                equals: this.localesService.getDefaultLocale().code,
              },
            },
          },
        },
        isPublic: true,
        AND: Object.keys(filters).length
          ? Object.entries(filters).map(([key, values]) => ({
              Attributes: {
                some: {
                  AttributeKey: {
                    key: key,
                  },
                  value: {
                    in: values,
                  },
                },
              },
            }))
          : undefined,
        OR: [
          {
            Product: {
              slug: {
                contains: searchTerm || undefined,
              },
            },
          },
          {
            sku: {
              contains: searchTerm || undefined,
            },
          },
          {
            Product: {
              ProductTranslations: {
                some: {
                  name: {
                    contains: searchTerm || undefined,
                  },
                },
              },
            },
          },
          {
            Product: {
              ProductTranslations: {
                some: {
                  description: {
                    search: searchTerm || undefined,
                  },
                  markdownContent: {
                    search: searchTerm || undefined,
                  },
                },
              },
            },
          },
        ],
      },
      orderBy: [
        { productId: 'asc' },
        { id: 'asc' },
        sortingArgs.sortBy
          ? {
              [sortingArgs.sortBy]:
                sortingArgs.ascending === false ? 'desc' : 'asc',
            }
          : {},
      ],
      cursor:
        paginationArgs.cursor == null
          ? undefined
          : {
              id: paginationArgs.cursor,
            },
      take: paginationArgs.pageSize + 1,
    });

    const hasNextPage = productVariants.length === paginationArgs.pageSize + 1;
    const nextCursor = hasNextPage ? productVariants.pop()!.id : null;

    return {
      nextCursor,
      totalCount: productVariants.length,
      edges: productVariants.map((pv) => ({
        cursor: pv.id,
        node: {
          id: pv.id,
          createdAt: pv.createdAt,
          isPublic: pv.isPublic,
          priceInCents: pv.priceInCents,
          productId: pv.productId,
          sku: pv.sku,
          stock: pv.stock,
          updatedAt: pv.updatedAt,
        },
      })),
    };
  }

  async findAllByIds(ids: number[]): Promise<(ProductVariant | null)[]> {
    const productVariants = await this.prisma.productVariant.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return ids.map((id) => productVariants.find((pv) => pv.id === id) || null);
  }

  async findAll(
    paginationArgs: PaginationArgs,
    productQueryArgs: ProductFindAllQueryArgs,
    sortingArgs: SortingArgs,
    role?: AuthenticatedUserDto['role'],
  ): Promise<PaginatedProductVariant> {
    this.validatePaginationArgs(paginationArgs);
    this.validateProductFindAllQueryArgs(productQueryArgs, role);
    this.validateSortingArgs(sortingArgs);

    if (productQueryArgs.isSetup == null) {
      const productVariants = await this.prisma.productVariant.findMany({
        where: {
          Product: {
            isPublic:
              productQueryArgs.isPublic == null
                ? undefined
                : productQueryArgs.isPublic,
            categoryId:
              productQueryArgs.categoryId == null
                ? undefined
                : productQueryArgs.categoryId === 0
                  ? null
                  : productQueryArgs.categoryId,
            slug:
              productQueryArgs.slug == null
                ? undefined
                : {
                    contains: productQueryArgs.slug,
                  },
          },
        },
        select: {
          id: true,
          isPublic: true,
          sku: true,
          priceInCents: true,
          productId: true,
          stock: true,
          createdAt: true,
          updatedAt: true,
        },
        cursor:
          paginationArgs.cursor == null
            ? undefined
            : {
                id: paginationArgs.cursor,
              },
        take: paginationArgs.pageSize + 1,
        orderBy: [
          { productId: 'asc' },
          { id: 'asc' },
          sortingArgs.sortBy === null
            ? {}
            : {
                [sortingArgs.sortBy]:
                  sortingArgs.ascending === false ? 'desc' : 'asc',
              },
        ],
      });
      const hasNextPage =
        productVariants.length === paginationArgs.pageSize + 1;
      const nextCursor = hasNextPage ? productVariants.pop()!.id : null;

      return {
        nextCursor,
        totalCount: productVariants.length,
        edges: productVariants.map((pv) => ({
          cursor: pv.id,
          node: {
            id: pv.id,
            isPublic: pv.isPublic,
            priceInCents: pv.priceInCents,
            productId: pv.productId,
            sku: pv.sku,
            stock: pv.stock,
            createdAt: pv.createdAt,
            updatedAt: pv.updatedAt,
          },
        })),
      };
    } else {
      const productVariants =
        productQueryArgs.isSetup === true
          ? await this.prisma.productVariant.findMany({
              where: {
                Product: {
                  isPublic:
                    productQueryArgs.isPublic == null
                      ? undefined
                      : productQueryArgs.isPublic,
                  categoryId:
                    productQueryArgs.categoryId == null
                      ? undefined
                      : productQueryArgs.categoryId === 0
                        ? null
                        : productQueryArgs.categoryId,
                  slug:
                    productQueryArgs.slug == null
                      ? undefined
                      : {
                          contains: productQueryArgs.slug,
                        },
                  ProductTranslations: {
                    some: {
                      locale: {
                        equals: this.localesService.getDefaultLocale().code,
                      },
                    },
                  },
                },
              },
            })
          : await this.prisma.productVariant.findMany({
              where: {
                Product: {
                  isPublic:
                    productQueryArgs.isPublic == null
                      ? undefined
                      : productQueryArgs.isPublic,
                  categoryId:
                    productQueryArgs.categoryId == null
                      ? undefined
                      : productQueryArgs.categoryId === 0
                        ? null
                        : productQueryArgs.categoryId,
                  slug:
                    productQueryArgs.slug == null
                      ? undefined
                      : {
                          contains: productQueryArgs.slug,
                        },
                  ProductTranslations: {
                    none: {
                      locale: {
                        equals: this.localesService.getDefaultLocale().code,
                      },
                    },
                  },
                },
              },
            });

      const hasNextPage =
        productVariants.length === paginationArgs.pageSize + 1;
      const nextCursor = hasNextPage ? productVariants.pop()!.id : null;

      return {
        nextCursor,
        totalCount: productVariants.length,
        edges: productVariants.map((pv) => ({
          cursor: pv.id,
          node: {
            id: pv.id,
            isPublic: pv.isPublic,
            priceInCents: pv.priceInCents,
            productId: pv.productId,
            sku: pv.sku,
            stock: pv.stock,
            createdAt: pv.createdAt,
            updatedAt: pv.updatedAt,
          },
        })),
      };
    }
  }

  async findAllForCategory(
    categoryId: number,
    paginationArgs: PaginationArgs,
    attributeFilters?: string[][],
  ): Promise<PaginatedProductVariant> {
    this.validatePaginationArgs(paginationArgs);
    const filters = attributeFilters
      ? await this.extractAttributeFilters(attributeFilters)
      : {};
    const allCategories = await this.prisma.$transaction(async (tx) => {
      const res: number[] = [];
      const categoriesToProcess = [categoryId];
      while (categoriesToProcess.length > 0) {
        const currentCategoryId = categoriesToProcess.pop()!;
        res.push(currentCategoryId);
        const childCategories = await tx.category.findMany({
          where: {
            parentCategoryId: currentCategoryId,
          },
          select: {
            id: true,
          },
        });
        categoriesToProcess.push(...childCategories.map((c) => c.id));
      }
      return res;
    });

    if (allCategories.length === 0) {
      return {
        nextCursor: null,
        totalCount: 0,
        edges: [],
      };
    }

    const productVariants = await this.prisma.productVariant.findMany({
      where: {
        isPublic: true,
        Product: {
          categoryId: {
            in: allCategories,
          },
          ProductTranslations: {
            some: {
              locale: {
                equals: this.localesService.getDefaultLocale().code,
              },
            },
          },
          isPublic: true,
        },
        ...(Object.keys(filters).length > 0
          ? {
              AND: Object.entries(filters).map(([key, values]) => ({
                Attributes: {
                  some: {
                    AttributeKey: {
                      key: key,
                    },
                    value: {
                      in: values,
                    },
                  },
                },
              })),
            }
          : {}),
      },
      select: {
        id: true,
        stock: true,
        sku: true,
        priceInCents: true,
        productId: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        Product: {
          select: {
            _count: {
              select: {
                ProductTranslations: {
                  where: {
                    locale: {
                      equals: this.localesService.locales().english.code,
                    },
                  },
                },
              },
            },
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
      orderBy: [
        {
          productId: 'asc',
        },
        {
          id: 'asc',
        },
      ],
    });

    const hasNextPage = productVariants.length === paginationArgs.pageSize + 1;
    const nextCursor = hasNextPage ? productVariants.pop()!.id : null;

    return {
      nextCursor,
      totalCount: productVariants.length,
      edges: productVariants.map((pv) => ({
        cursor: pv.id,
        node: {
          id: pv.id,
          isPublic: pv.isPublic,
          priceInCents: pv.priceInCents,
          productId: pv.productId,
          sku: pv.sku,
          stock: pv.stock,
          createdAt: pv.createdAt,
          updatedAt: pv.updatedAt,
        },
      })),
    };
  }

  async getAllAttributesForVariantsByBatch(productVariantIds: number[]) {
    const atributes = await this.prisma.attribute.findMany({
      where: {
        ProductVariants: {
          some: {
            id: {
              in: productVariantIds,
            },
          },
        },
      },
      select: {
        id: true,
        attributeKeyId: true,
        ProductVariants: {
          select: {
            id: true,
          },
        },
        value: true,
      },
    });

    return productVariantIds.map((id) =>
      atributes.filter((attr) =>
        attr.ProductVariants.some((pv) => pv.id === id),
      ),
    );
  }

  async getAllImagesForVariantsByBatch(productVariantIds: number[]) {
    const images = await this.prisma.productVariantImage.findMany({
      where: {
        productVariantId: {
          in: productVariantIds,
        },
      },
    });

    return productVariantIds.map((id) =>
      images.filter((img) => img.productVariantId === id),
    );
  }

  async getProductVariantsByIds(ids: number[]): Promise<ProductVariant[]> {
    const productVariants = await this.prisma.productVariant.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return ids.map((id) => productVariants.find((pv) => pv.id === id)!);
  }
}
