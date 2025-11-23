import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductVariantInput } from './dto/create-product-variant.input';
import { UpdateProductVariantInput } from './dto/update-product-variant.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocalesService } from 'src/locales/locales.service';
import { ProductVariantImage } from 'src/entities/product-variant.image.entity';

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

  async addImage(
    productVariantId: number,
    base64: string,
    mimeType: string,
  ): Promise<ProductVariantImage> {
    if (!mimeType.startsWith('image/')) {
      throw new BadRequestException(
        'product-variants.service.invalidImageMimeType',
      );
    }

    const [productVariant, foundThumbnailImage] =
      await this.prisma.$transaction(async (tx) => {
        const pv = await tx.productVariant.findUnique({
          where: { id: productVariantId },
          select: {
            id: true,
          },
        });

        const thumbnailImage = await tx.productImage.findFirst({
          where: {
            productVariantId,
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

    const created = await this.prisma.productImage.create({
      data: {
        base64,
        mimeType,
        isThumbnail,
        productVariantId,
      },
    });

    return {
      ...created,
      productVariantId: created.productVariantId!,
    };
  }

  async removeImage(id: number): Promise<number> {
    const [imageToDelete, nextThumbnailImage] = await this.prisma.$transaction(
      async (tx) => {
        const image = await tx.productImage.findUnique({
          where: { id },
        });

        if (!image) {
          return [null, null];
        }
        let nextThumbnail = null;
        if (image.isThumbnail) {
          nextThumbnail = await tx.productImage.findFirst({
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

    return this.prisma.$transaction(async (tx) => {
      await tx.productImage.delete({
        where: { id: imageToDelete.id },
      });

      if (nextThumbnailImage) {
        await tx.productImage.update({
          where: {
            id: nextThumbnailImage.id,
          },
          data: {
            isThumbnail: true,
          },
        });
      }

      return imageToDelete.productVariantId!;
    });
  }

  async setThumbnailImage(id: number): Promise<ProductVariantImage> {
    const image = await this.prisma.productImage.findUnique({
      where: { id },
    });

    if (!image) {
      throw new BadRequestException('product-variants.service.imageNotFound');
    }

    const updatedImage = await this.prisma.$transaction(async (tx) => {
      await tx.productImage.updateMany({
        where: {
          productVariantId: image.productVariantId,
          isThumbnail: true,
        },
        data: {
          isThumbnail: false,
        },
      });

      return tx.productImage.update({
        where: { id },
        data: {
          isThumbnail: true,
        },
      });
    });

    return {
      ...updatedImage,
      productVariantId: updatedImage.productVariantId!,
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
