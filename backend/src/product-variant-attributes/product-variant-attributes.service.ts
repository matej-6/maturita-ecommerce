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
}
