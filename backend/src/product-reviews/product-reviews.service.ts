import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PaginatedProductReview,
  ProductReview,
} from './entities/productReview.entity';
import { PaginationArgs } from 'src/lib/pagination.args';
import { UserDto } from 'src/users/dto/user.dto';
import { ImageStorageService } from 'src/image-storage/image-storage.service';
import { CreateProductReviewInput } from './inputs/createProductReview.input';
import { LocalesService } from 'src/locales/locales.service';
import { UpdateProductReviewInput } from './inputs/updateProductReview.input';
import { ProductReviewAuthor } from './entities/productReviewAuthor.entity';
import { ProductVariantsService } from 'src/product-variants/product-variants.service';
import { ProductVariant } from 'src/product-variants/entities/product-variant.entity';

@Injectable()
export class ProductReviewsService {
  private readonly logger = new Logger(ProductReviewsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageStorageService: ImageStorageService,
    private readonly localesService: LocalesService,
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  private validatePaginationParams(params: PaginationArgs) {
    if (params.pageSize <= 0 || params.pageSize > 100) {
      params.pageSize = 25;
    }

    if (params.cursor !== null && params.cursor < 0) {
      params.cursor = null;
    }
  }

  async getPaginatedProductReviewsByProductId(
    productId: number,
    paginationParams: PaginationArgs,
  ): Promise<PaginatedProductReview> {
    this.validatePaginationParams(paginationParams);
    const productReviews = await this.prismaService.productReview.findMany({
      where: {
        OrderItem: {
          productId: productId,
        },
      },
      cursor:
        paginationParams.cursor !== null
          ? { id: paginationParams.cursor }
          : undefined,
      take: paginationParams.pageSize + 1,
      orderBy: { createdAt: 'desc' },
    });
    return {
      nextCursor:
        productReviews.length > paginationParams.pageSize
          ? productReviews.pop()!.id
          : null,
      totalCount: productReviews.length,
      edges: productReviews.map((review) => ({
        cursor: review.id,
        node: review,
      })),
    };
  }

  async getAuthorByProductReviewId(
    reviewId: number,
  ): Promise<Partial<UserDto> | null> {
    const review = await this.prismaService.productReview.findUnique({
      where: { id: reviewId },
      select: { userId: true },
    });

    if (!review || !review.userId) {
      return null;
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: review.userId },
      select: {
        firstName: true,
        lastName: true,
        avatarFileName: true,
      },
    });

    this.logger.debug(
      `Fetched author for review ${reviewId}: ${user?.firstName} ${user?.lastName} and avatar ${user?.avatarFileName}`,
    );

    return {
      firstName: user?.firstName,
      lastName: user?.lastName,
      avatarUrl: user?.avatarFileName
        ? this.imageStorageService.getImageUrl(user.avatarFileName)
        : null,
    };
  }

  async createProductReview(
    userId: number,
    createProductReviewInput: CreateProductReviewInput,
  ): Promise<ProductReview> {
    const { orderItemId, rating, comment, lang } = createProductReviewInput;

    const foundLocale = this.localesService.findOne(lang);

    if (!foundLocale) {
      throw new BadRequestException(
        'product-reviews.service.create.invalidLocale',
      );
    }

    const orderItem = await this.prismaService.orderItem.findUnique({
      where: { id: orderItemId },
      select: {
        Order: {
          select: {
            status: true,
            userId: true,
          },
        },
        productReview: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!orderItem || orderItem.Order.userId !== userId) {
      throw new BadRequestException(
        'product-reviews.service.create.orderItemNotFound',
      );
    }

    if (orderItem.Order.status !== 'DELIVERED') {
      throw new BadRequestException(
        'product-reviews.service.create.orderNotDelivered',
      );
    }

    if (orderItem.productReview) {
      throw new BadRequestException(
        'product-reviews.service.create.reviewAlreadyExists',
      );
    }

    const productReview = await this.prismaService.productReview.create({
      data: {
        userId,
        rating,
        comment,
        lang: foundLocale.code,
        orderItemId: orderItemId,
      },
    });

    return productReview;
  }

  async updateProductReview(
    userId: number,
    updateProductReviewInput: UpdateProductReviewInput,
  ): Promise<ProductReview> {
    const { id, rating, comment, lang } = updateProductReviewInput;

    const foundLocale = this.localesService.findOne(lang);
    if (!foundLocale) {
      throw new BadRequestException(
        'product-reviews.service.update.invalidLocale',
      );
    }

    const review = await this.prismaService.productReview.findUnique({
      where: { id: id },
      select: { userId: true },
    });

    if (!review || review.userId !== userId) {
      throw new BadRequestException(
        'product-reviews.service.update.reviewNotFound',
      );
    }

    const updatedReview = await this.prismaService.productReview.update({
      where: { id: id },
      data: {
        rating,
        comment,
        lang: foundLocale.code,
      },
    });

    return updatedReview;
  }

  async deleteProductReview(userId: number, reviewId: number): Promise<void> {
    const review = await this.prismaService.productReview.findUnique({
      where: { id: reviewId },
      select: { userId: true },
    });

    if (!review || review.userId !== userId) {
      throw new BadRequestException(
        'product-reviews.service.delete.reviewNotFound',
      );
    }

    await this.prismaService.productReview.delete({
      where: { id: reviewId },
    });
  }

  async findProductIdByProductReviewId(
    reviewId: number,
  ): Promise<number | null> {
    const review = await this.prismaService.productReview.findUnique({
      where: { id: reviewId },
      select: {
        OrderItem: {
          select: {
            productId: true,
          },
        },
      },
    });

    return review?.OrderItem?.productId ?? null;
  }

  async findProductVariantIdByProductReviewId(
    reviewId: number,
  ): Promise<number | null> {
    const review = await this.prismaService.productReview.findUnique({
      where: { id: reviewId },
      select: {
        OrderItem: {
          select: {
            productVariantId: true,
          },
        },
      },
    });

    return review?.OrderItem?.productVariantId ?? null;
  }

  async getProductVariantsByProductReviewIds(
    reviewIds: number[],
  ): Promise<(ProductVariant | null)[]> {
    const reviews = await this.prismaService.productReview.findMany({
      where: {
        id: { in: reviewIds },
      },
      select: {
        id: true,
        OrderItem: {
          select: {
            productVariantId: true,
          },
        },
      },
    });

    const productVariants = await this.productVariantsService.findAllByIds(
      reviews
        .filter((r) => !!r.OrderItem && !!r.OrderItem.productVariantId)
        .map((r) => r.OrderItem!.productVariantId!),
    );

    return reviewIds.map((reviewId) => {
      const review = reviews.find((r) => r.id === reviewId);
      if (!review) return null;
      const productVariantId = review.OrderItem?.productVariantId;
      if (!productVariantId) return null;
      return (
        productVariants.find(
          (pv) => pv != null && pv.id === productVariantId,
        ) || null
      );
    });
  }

  async getReviewAuthorsByProductReviewIds(
    reviewIds: number[],
  ): Promise<(ProductReviewAuthor | null)[]> {
    const reviews = await this.prismaService.productReview.findMany({
      where: { id: { in: reviewIds } },
      select: {
        id: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
            avatarFileName: true,
          },
        },
      },
    });

    return reviewIds.map((reviewId) => {
      const review = reviews.find((r) => r.id === reviewId);
      return review && review.User
        ? {
            avatarUrl: review.User.avatarFileName
              ? this.imageStorageService.getImageUrl(review.User.avatarFileName)
              : null,
            firstName: review.User.firstName,
            lastName: review.User.lastName,
          }
        : null;
    });
  }

  async admin_deleteProductReview(reviewId: number): Promise<void> {
    const review = await this.prismaService.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new BadRequestException();
    }

    await this.prismaService.productReview.delete({
      where: { id: reviewId },
    });
  }
}
