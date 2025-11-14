import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { LocalesService } from 'src/locales/locales.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import { ProductFindAllQueryArgs as ProductFindAllQueryArgs } from './products.resolver.args';
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

  private validateFindAllQueryArgs(
    queryArgs: ProductFindAllQueryArgs,
    role?: AuthenticatedUserDto['role'],
  ) {
    queryArgs.isPublic = role === 'ADMIN' ? queryArgs.isPublic : true;
    queryArgs.isSetup = role === 'ADMIN' ? queryArgs.isSetup : true;
  }

  async findAll(
    paginationArgs: PaginationArgs,
    queryArgs: ProductFindAllQueryArgs,
    role?: AuthenticatedUserDto['role'],
  ): Promise<PaginatedProduct> {
    this.validatePaginationArgs(paginationArgs);
    this.validateFindAllQueryArgs(queryArgs, role);
    const products = await this.prisma.product.findMany({
      where: {
        isPublic: queryArgs.isPublic ?? undefined,
        categoryId: queryArgs.categoryId ?? undefined,
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
        node: p,
      })),
    };
  }

  async findOne(id: number, role?: AuthenticatedUserDto['role']) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: id,
        isPublic: role === 'ADMIN',
        // isSetup: role === 'ADMIN',
      },
    });
    if (!product) {
      this.logger.warn(
        `findOne(id=${id}, role?: ${role}) did not find any product`,
      );
    }

    return product;
  }

  async removeCategoryFromProducts(categoryId: number) {
    const productsWithCategory = await this.prisma.product.findMany({
      where: {
        categoryId: categoryId,
      },
    });

    await this.prisma.product.updateMany({
      where: {
        id: {
          in: productsWithCategory.map((p) => p.id),
        },
      },
      data: {
        categoryId: null,
      },
    });

    await Promise.all(
      productsWithCategory.map((p) => this.updateIsSetup(p.id)),
    );
  }

  async update(id: number, input: UpdateProductInput): Promise<Product> {
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
        slug: input.slug,
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
    });

    const isSetup = await this.updateIsSetup(id);

    return {
      ...updatedProduct,
      isSetup: isSetup,
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

  private async updateIsSetup(id: number) {
    try {
      const p = await this.prisma.product.findFirst({
        where: {
          id: id,
        },
        select: {
          isSetup: true,
          _count: {
            select: {
              ProductVariants: true,
              Images: {
                where: {
                  isThumbnail: true,
                },
              },
            },
          },
          ProductTranslations: {
            select: {
              locale: true,
            },
          },
        },
      });

      if (!p) {
        return false;
      }

      const isSetup =
        p.ProductTranslations.some(
          (t) => t.locale === this.localesService.locales().english.code,
        ) &&
        p._count.ProductVariants > 0 &&
        p._count.Images > 0;

      if (p.isSetup !== isSetup) {
        await this.prisma.product.update({
          where: {
            id: id,
          },
          data: {
            isSetup: isSetup,
          },
        });
      }

      return isSetup;
    } catch (e) {
      this.logger.error(
        `Failed to update isSetup for product with id ${id}: ${e}`,
      );
      return false;
    }
  }
}
