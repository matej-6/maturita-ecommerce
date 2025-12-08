import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

  async create(
    createProductVariantAttributeInput: CreateProductVariantAttributeInput,
  ) {
    const [existingAttribute, existingKey] = await this.prisma.$transaction(
      async (tx) => {
        const attribute = await tx.attribute.findFirst({
          where: {
            attributeKeyId: createProductVariantAttributeInput.keyId,
            value: createProductVariantAttributeInput.value,
          },
        });
        const key = await tx.attributeKey.findUnique({
          where: { id: createProductVariantAttributeInput.keyId },
        });
        return [attribute, key];
      },
    );

    if (existingAttribute) {
      throw new BadRequestException(
        'product-variant-attributes.service.attributeAlreadyExists',
      );
    }

    if (!existingKey) {
      throw new BadRequestException(
        'product-variant-attributes.service.attributeKeyNotFound',
      );
    }

    return this.prisma.attribute.create({
      data: {
        value: createProductVariantAttributeInput.value,
        attributeKeyId: createProductVariantAttributeInput.keyId,
      },
    });
  }

  async findAll() {
    return await this.prisma.attribute.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.attribute.findUnique({
      where: { id },
    });
  }

  async update(
    updateProductVariantAttributeInput: UpdateProductVariantAttributeInput,
  ) {
    const attributeToUpdate = await this.prisma.attribute.findUnique({
      where: { id: updateProductVariantAttributeInput.id },
    });

    if (!attributeToUpdate) {
      throw new BadRequestException(
        'product-variant-attributes.service.attributeNotFound',
      );
    }

    const existingAttribute = await this.prisma.attribute.findFirst({
      where: {
        attributeKeyId: attributeToUpdate.attributeKeyId,
        value: updateProductVariantAttributeInput.value,
      },
    });

    if (existingAttribute?.id === updateProductVariantAttributeInput.id) {
      return existingAttribute;
    }

    if (existingAttribute) {
      throw new BadRequestException(
        'product-variant-attributes.service.attributeAlreadyExists',
      );
    }

    return this.prisma.attribute.update({
      where: { id: updateProductVariantAttributeInput.id },
      data: {
        value: updateProductVariantAttributeInput.value,
      },
    });
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

  async findAllUsedInCategory(categoryId: number) {
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
      return [];
    }

    return await this.prisma.attribute.findMany({
      where: {
        ProductVariants: {
          some: {
            Product: {
              categoryId: {
                in: allCategories,
              },
            },
          },
        },
      },
    });
  }
}
