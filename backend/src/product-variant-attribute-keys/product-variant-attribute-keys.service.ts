import { Injectable, Logger } from '@nestjs/common';
import { CreateProductVariantAttributeKeyInput } from './dto/create-product-variant-attribute-key.input';
import { UpdateProductVariantAttributeKeyInput } from './dto/update-product-variant-attribute-key.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocalesService } from 'src/locales/locales.service';

@Injectable()
export class ProductVariantAttributeKeysService {
  private readonly logger = new Logger(ProductVariantAttributeKeysService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localesService: LocalesService,
  ) {}

  create(
    createProductVariantAttributeKeyInput: CreateProductVariantAttributeKeyInput,
  ) {
    return 'This action adds a new productVariantAttributeKey';
  }

  async findAll(productId: number | null) {
    return await this.prisma.attributeKey.findMany({
      where: {
        Attributes: {
          some: {
            ProductVariants: {
              some: {
                productId: productId ?? undefined,
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

  update(
    id: number,
    updateProductVariantAttributeKeyInput: UpdateProductVariantAttributeKeyInput,
  ) {
    return `This action updates a #${id} productVariantAttributeKey`;
  }

  remove(id: number) {
    return `This action removes a #${id} productVariantAttributeKey`;
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
}
