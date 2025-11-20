import { Injectable, Logger } from '@nestjs/common';
import { CreateProductVariantAttributeInput } from './dto/create-product-variant-attribute.input';
import { UpdateProductVariantAttributeInput } from './dto/update-product-variant-attribute.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocalesService } from 'src/locales/locales.service';

@Injectable()
export class ProductVariantAttributesService {
  private readonly logger = new Logger(ProductVariantAttributesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localesService: LocalesService,
  ) {}

  create(
    createProductVariantAttributeInput: CreateProductVariantAttributeInput,
  ) {
    return 'This action adds a new productVariantAttribute';
  }

  findAll() {
    return `This action returns all productVariantAttributes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productVariantAttribute`;
  }

  update(
    id: number,
    updateProductVariantAttributeInput: UpdateProductVariantAttributeInput,
  ) {
    return `This action updates a #${id} productVariantAttribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} productVariantAttribute`;
  }

  async getAttributeKeysByBatch(attributeIds: number[]) {
    const keys = await this.prisma.attributeKey.findMany({
      where: {
        id: {
          in: attributeIds,
        },
      },
    });

    return attributeIds.map((id) => keys.find((key) => key.id === id) ?? null);
  }

  async getTranslationsByBatch(locale: string, attributeIds: number[]) {
    const translations = await this.prisma.attributeTranslation.findMany({
      where: {
        attributeId: {
          in: attributeIds,
        },
        locale: {
          in: [locale, this.localesService.getDefaultLocale().code],
        },
      },
    });
    return attributeIds.map((id) => {
      const filtered = translations.filter((t) => t.attributeId === id);
      if (filtered.length === 0) {
        return null;
      }
      const translation = filtered.find((t) => t.locale === locale);
      return translation ?? filtered[0];
    });
  }

  async getAllTranslationsByBatch(attributeIds: number[]) {
    const translations = await this.prisma.attributeTranslation.findMany({
      where: {
        attributeId: {
          in: attributeIds,
        },
      },
    });

    return attributeIds.map((id) =>
      translations.filter((t) => t.attributeId === id),
    );
  }
}
