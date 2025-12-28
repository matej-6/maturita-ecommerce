import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductVariantAttributeKeyInput } from './dto/create-product-variant-attribute-key.input';
import { UpdateProductVariantAttributeKeyInput } from './dto/update-product-variant-attribute-key.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocalesService } from 'src/locales/locales.service';
import { CreateProductVariantAttributeKeyTranslationInput } from './dto/create-product-variant-attribute-key-translation.input';
import { UpdateProductVariantAttributeKeyTranslationInput } from './dto/update-product-variant-attribute-key-translation.input';
import { PaginationArgs } from 'src/lib/pagination.args';
import {
  AttributeKeyFindAllQueryArgs,
  AttributeKeySortingArgs,
} from './product-variant-attributes-keys.args';
import { PaginatedProductVariantAttributeKey } from './entities/product-variant-attribute-key.entity';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import { ERROR } from 'src/errors';

@Injectable()
export class ProductVariantAttributeKeysService {
  private readonly logger = new Logger(ProductVariantAttributeKeysService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localesService: LocalesService,
  ) {}

  async create(
    createProductVariantAttributeKeyInput: CreateProductVariantAttributeKeyInput,
  ) {
    const existingKey = await this.prisma.attributeKey.findFirst({
      where: { key: createProductVariantAttributeKeyInput.key },
    });

    if (existingKey) {
      throw new Error(
        'product-variant-attribute-keys.service.attributeKeyAlreadyExists',
      );
    }

    return this.prisma.attributeKey.create({
      data: {
        key: createProductVariantAttributeKeyInput.key,
      },
    });
  }

  async findAll(productId: number | null) {
    return await this.prisma.attributeKey.findMany({
      where: {
        Attributes:
          productId === null
            ? undefined
            : {
                some: {
                  ProductVariants: {
                    some: {
                      productId: productId,
                    },
                  },
                },
              },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.attributeKey.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(
    updateProductVariantAttributeKeyInput: UpdateProductVariantAttributeKeyInput,
  ) {
    const keyToUpdate = await this.prisma.attributeKey.findUnique({
      where: {
        id: updateProductVariantAttributeKeyInput.id,
      },
    });

    if (!keyToUpdate) {
      throw new BadRequestException(
        'product-variant-attribute-keys.service.attributeKeyNotFound',
      );
    }

    try {
      return this.prisma.attributeKey.update({
        where: {
          id: updateProductVariantAttributeKeyInput.id,
        },
        data: {
          key: updateProductVariantAttributeKeyInput.key,
        },
      });
    } catch (e) {
      this.logger.error(
        `Error updating attribute key: ${e instanceof Error ? e.message : e}`,
      );
      if (e instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException(ERROR.badRequest);
      } else {
        throw e;
      }
    }
  }

  async remove(id: number) {
    const attributesWithKey = await this.prisma.attribute.count({
      where: {
        attributeKeyId: id,
      },
    });

    if (attributesWithKey > 0) {
      throw new BadRequestException(
        'product-variant-attribute-keys.service.cannotDeleteKeyInUse',
      );
    }

    return await this.prisma.attributeKey.delete({
      where: { id: id },
    });
  }

  async getTranslationsByBatch(locale: string, keyIds: number[]) {
    const translations = await this.prisma.attributeKeyTranslation.findMany({
      where: {
        id: {
          in: keyIds,
        },
        locale: {
          in: [locale, this.localesService.getDefaultLocale().code],
        },
      },
    });

    return keyIds.map((id) => {
      const translationsForKey = translations.filter(
        (t) => t.attributeKeyId === id,
      );
      if (translationsForKey.length === 0) {
        return null;
      }
      const translationForLocale = translationsForKey.find(
        (t) => t.locale === locale,
      );
      if (translationForLocale) {
        return translationForLocale;
      }
      return translationsForKey[0];
    });
  }

  async getAllTranslationsByBatch(keyIds: number[]) {
    const translations = await this.prisma.attributeKeyTranslation.findMany({
      where: {
        attributeKeyId: {
          in: keyIds,
        },
      },
    });

    return keyIds.map((id) =>
      translations.filter((t) => t.attributeKeyId === id),
    );
  }

  async getAllAttributesByBatch(keyIds: number[]) {
    const attributes = await this.prisma.attribute.findMany({
      where: {
        attributeKeyId: {
          in: keyIds,
        },
      },
    });

    return keyIds.map((id) =>
      attributes.filter((a) => a.attributeKeyId === id),
    );
  }

  async createTranslation(
    input: CreateProductVariantAttributeKeyTranslationInput,
  ) {
    const locale = this.localesService.findOne(input.localeCode);
    if (!locale) {
      throw new Error('locales.service.localeNotFound');
    }

    const existingTranslation =
      await this.prisma.attributeKeyTranslation.findFirst({
        where: {
          attributeKeyId: input.keyId,
          locale: input.localeCode,
        },
      });

    if (existingTranslation) {
      throw new Error(
        'product-variant-attribute-keys.service.translationAlreadyExists',
      );
    }

    return this.prisma.attributeKeyTranslation.create({
      data: {
        attributeKeyId: input.keyId,
        locale: input.localeCode,
        keyTranslation: input.keyTranslation,
      },
    });
  }

  async updateTranslation(
    input: UpdateProductVariantAttributeKeyTranslationInput,
  ) {
    const translationToUpdate =
      await this.prisma.attributeKeyTranslation.findUnique({
        where: {
          id: input.id,
        },
      });

    if (!translationToUpdate) {
      throw new Error(
        'product-variant-attribute-keys.service.translationNotFound',
      );
    }

    if (input.localeCode !== translationToUpdate.locale) {
      const locale = this.localesService.findOne(input.localeCode);
      if (!locale) {
        throw new Error('locales.service.localeNotFound');
      }

      const existingTranslation =
        await this.prisma.attributeKeyTranslation.findFirst({
          where: {
            attributeKeyId: translationToUpdate.attributeKeyId,
            locale: input.localeCode,
          },
        });

      if (existingTranslation) {
        throw new Error(
          'product-variant-attribute-keys.service.translationAlreadyExists',
        );
      }
    }

    return this.prisma.attributeKeyTranslation.update({
      where: {
        id: input.id,
      },
      data: {
        locale: input.localeCode,
        keyTranslation: input.keyTranslation,
      },
    });
  }

  async deleteTranslation(id: number) {
    try {
      return this.prisma.attributeKeyTranslation.delete({
        where: {
          id: id,
        },
      });
    } catch (e) {
      this.logger.error(
        `Error deleting attribute key translation: ${e instanceof Error ? e.message : e}`,
      );
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new BadRequestException(
            'product-variant-attribute-keys.service.translationNotFound',
          );
        }
        throw new BadRequestException(ERROR.badRequest);
      } else {
        throw e;
      }
    }
  }

  async findAllPaginated(
    paginationArgs: PaginationArgs,
    findAllQueryArgs: AttributeKeyFindAllQueryArgs,
    sortByArgs: AttributeKeySortingArgs,
  ): Promise<PaginatedProductVariantAttributeKey> {
    paginationArgs.validateFields();

    const keys = await this.prisma.attributeKey.findMany({
      where: {
        id: findAllQueryArgs.id ?? undefined,
        key: findAllQueryArgs.key
          ? {
              contains: findAllQueryArgs.key,
            }
          : undefined,
      },
      cursor:
        paginationArgs.cursor === null
          ? undefined
          : { id: paginationArgs.cursor },
      take: paginationArgs.pageSize + 1,
      orderBy: sortByArgs.sortBy
        ? {
            [sortByArgs.sortBy]: sortByArgs.ascending ? 'asc' : 'desc',
          }
        : { id: 'asc' },
    });

    const hasNextPage = keys.length > paginationArgs.pageSize;
    if (hasNextPage) {
      keys.pop();
    }

    return {
      hasNextPage: hasNextPage,
      totalCount: keys.length,
      edges: keys.map((k) => ({
        cursor: k.id,
        node: k,
      })),
    };
  }
}
