import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedProductReview } from './entities/productReview.entity';
import { PaginationArgs } from 'src/lib/pagination.args';
import { UserDto } from 'src/users/dto/user.dto';
import { ImageStorageService } from 'src/image-storage/image-storage.service';

@Injectable()
export class ProductReviewsService {
  private readonly logger = new Logger(ProductReviewsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageStorageService: ImageStorageService,
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
      where: { productId },
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
}
