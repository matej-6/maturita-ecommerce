import { Injectable, Logger } from '@nestjs/common';
import { CreateProductVariantInput } from './dto/create-product-variant.input';
import { UpdateProductVariantInput } from './dto/update-product-variant.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocalesService } from 'src/locales/locales.service';

@Injectable()
export class ProductVariantsService {
  private readonly logger = new Logger(ProductVariantsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localesService: LocalesService,
  ) {}

  create(createProductVariantInput: CreateProductVariantInput) {
    return 'This action adds a new productVariant';
  }

  update(id: number, updateProductVariantInput: UpdateProductVariantInput) {
    return `This action updates a #${id} productVariant`;
  }

  remove(id: number) {
    return `This action removes a #${id} productVariant`;
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
    const images = await this.prisma.productImage.findMany({
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
}
