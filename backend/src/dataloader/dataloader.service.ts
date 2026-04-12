import { Injectable } from '@nestjs/common';
import { IDataLoaders } from './dataloader.interface';
import * as DataLoader from 'dataloader';
import {
  Attribute,
  AttributeKey,
  Category,
  CategoryTranslation,
  ProductTranslation,
  ProductVariant,
  AttributeKeyTranslation,
  AttributeTranslation,
  ProductImage,
  ProductVariantImage,
} from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoriesService } from 'src/categories/categories.service';
import { I18nContext } from 'nestjs-i18n';
import { DEFAULT_LOCALE } from 'src/locales';
import { ProductsService } from 'src/products/products.service';
import { ProductVariantsService } from 'src/product-variants/product-variants.service';
import { ProductVariantAttributesService } from 'src/product-variant-attributes/product-variant-attributes.service';

import { ProductVariantAttributeKeysService } from 'src/product-variant-attribute-keys/product-variant-attribute-keys.service';
import { Product } from 'src/products/entities/product.entity';
import { CartItemsService } from 'src/cart-items/cart-items.service';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { ProductReview } from 'src/product-reviews/entities/productReview.entity';
import { ProductReviewAuthor } from 'src/product-reviews/entities/productReviewAuthor.entity';
import { ProductReviewsService } from 'src/product-reviews/product-reviews.service';

@Injectable()
export class DataloaderService {
  constructor(
    private readonly db: PrismaService,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
    private readonly productVariantsService: ProductVariantsService,
    private readonly productVariantAttributesService: ProductVariantAttributesService,
    private readonly productVariantAttributeKeysService: ProductVariantAttributeKeysService,
    private readonly cartItemsService: CartItemsService,
    private readonly orderItemsService: OrderItemsService,
    private readonly productReviewService: ProductReviewsService,
  ) {}

  getLoaders(): IDataLoaders {
    const locale = I18nContext.current()?.lang || DEFAULT_LOCALE.code;

    const subcategoriesLoader = this.createSubcategoriesLoader();
    const categoryTranslationLoader =
      this.createCategoryTranslationLoader(locale);
    const categoryProductsCountLoader =
      this.createCategoryProductsCountLoader();
    const productTranslationLoader =
      this.createProductTranslationLoader(locale);
    const productAllTranslationsLoader =
      this.createProductAllTranslationsLoader();
    const productAllVariantsLoader = this.createProductAllVariantsLoader();
    const productVariantAllAttributesLoader =
      this.createProductVariantAllAttributesLoader();
    const attributeKeyByIdLoader = this.createAttributeKeyByIdLoader();
    const attributeKeyTranslationLoader =
      this.createAttributeKeyTranslationLoader(locale);
    const attributeKeyAllTranslationsLoader =
      this.createAttributeKeyAllTranslationsLoader();
    const productVariantAttributeTranslationLoader =
      this.createProductVariantAttributeTranslationLoader(locale);
    const productVariantAttributeAllTranslationsLoader =
      this.createProductVariantAttributeAllTranslationsLoader();
    const productAllImagesLoader = this.createProductAllImagesLoader();
    const productVariantAllImagesLoader =
      this.createProductVariantAllImagesLoader();
    const attributesByKeyLoader = this.createAttributesByKeyLoader();
    const productVariantProductLoader =
      this.createProductVariantProductLoader();
    const cartItemProductVariantLoader =
      this.createCartItemProductVariantLoader();
    const orderItemProductVariantLoader =
      this.createOrderItemProductVariantLoader();
    const productVariantsByAttributeIdLoader =
      this.createProductVariantsByAttributeIdLoader();
    const orderItemProductReviewLoader =
      this.createOrderItemProductReviewLoader();
    const productReviewAuthorLoader = this.createProductReviewAuthorLoader();
    const productVariantByProductReviewIdLoader =
      this.createProductVariantByProductReviewIdLoader();
    return {
      subcategoriesLoader,
      categoryTranslationLoader,
      categoryProductsCountLoader,
      productTranslationLoader,
      productAllTranslationsLoader,
      productAllVariantsLoader,
      productVariantAllAttributesLoader,
      attributeKeyByIdLoader,
      attributeKeyTranslationLoader,
      attributeKeyAllTranslationsLoader,
      productVariantAttributeTranslationLoader,
      productVariantAttributeAllTranslationsLoader,
      productAllImagesLoader,
      productVariantAllImagesLoader,
      attributesByKeyLoader,
      productVariantProductLoader,
      cartItemProductVariantLoader,
      orderItemProductVariantLoader,
      productVariantsByAttributeIdLoader,
      orderItemProductReviewLoader,
      productReviewAuthorLoader,
      productVariantByProductReviewIdLoader,
    };
  }

  private createCategoryProductsCountLoader() {
    return new DataLoader<number, number>(async (categoryIds: number[]) => {
      const counts = await this.db.product.groupBy({
        by: ['categoryId'],
        where: {
          categoryId: {
            in: categoryIds,
          },
        },
        _count: true,
      });

      return categoryIds.map((id) => {
        const countRecord = counts.find((c) => c.categoryId === id);
        return countRecord ? countRecord._count : 0;
      });
    });
  }

  private createSubcategoriesLoader() {
    return new DataLoader<number, Category[]>(async (categoryIds: number[]) => {
      return await this.categoriesService.getCategorySubcategoriesByBatch(
        categoryIds,
      );
    });
  }

  private createCategoryTranslationLoader(lang: string) {
    return new DataLoader<number, CategoryTranslation | null>(
      async (categoryIds: number[]) => {
        return await this.categoriesService.getAllTranslationsByBatch(
          lang,
          categoryIds,
        );
      },
    );
  }

  private createProductTranslationLoader(lang: string) {
    return new DataLoader<number, ProductTranslation | null>(
      async (productIds: number[]) => {
        return await this.productsService.getAllTranslationsByBatch(
          lang,
          productIds,
        );
      },
    );
  }

  private createProductAllTranslationsLoader() {
    return new DataLoader<number, ProductTranslation[]>(
      async (productIds: number[]) => {
        return await this.productsService.getAllTranslationsForProductsByBatch(
          productIds,
        );
      },
    );
  }

  private createProductAllVariantsLoader() {
    return new DataLoader<number, ProductVariant[]>(
      async (productIds: number[]) => {
        return await this.productsService.getAllVariantsForProductsByBatch(
          productIds,
        );
      },
    );
  }

  private createProductVariantAllAttributesLoader() {
    return new DataLoader<number, Attribute[]>(
      async (productVariantIds: number[]) => {
        return await this.productVariantsService.getAllAttributesForVariantsByBatch(
          productVariantIds,
        );
      },
    );
  }

  private createAttributeKeyByIdLoader() {
    return new DataLoader<number, AttributeKey | null>(
      async (attributeIds: number[]) => {
        return await this.productVariantAttributesService.getAttributeKeysByBatch(
          attributeIds,
        );
      },
    );
  }

  private createAttributeKeyTranslationLoader(lang: string) {
    return new DataLoader<number, AttributeKeyTranslation | null>(
      async (attributeKeyIds: number[]) => {
        return await this.productVariantAttributeKeysService.getTranslationsByBatch(
          lang,
          attributeKeyIds,
        );
      },
    );
  }

  private createAttributeKeyAllTranslationsLoader() {
    return new DataLoader<number, AttributeKeyTranslation[]>(
      async (attributeKeyIds: number[]) => {
        return await this.productVariantAttributeKeysService.getAllTranslationsByBatch(
          attributeKeyIds,
        );
      },
    );
  }

  private createProductVariantAttributeTranslationLoader(lang: string) {
    return new DataLoader<number, AttributeTranslation | null>(
      async (attributeIds: number[]) => {
        return await this.productVariantAttributesService.getTranslationsByBatch(
          lang,
          attributeIds,
        );
      },
    );
  }

  private createProductVariantAttributeAllTranslationsLoader() {
    return new DataLoader<number, AttributeTranslation[]>(
      async (attributeIds: number[]) => {
        return await this.productVariantAttributesService.getAllTranslationsByBatch(
          attributeIds,
        );
      },
    );
  }

  private createProductAllImagesLoader() {
    return new DataLoader<number, ProductImage[]>(
      async (productIds: number[]) => {
        return await this.productsService.getAllImagesForProductsByBatch(
          productIds,
        );
      },
    );
  }

  private createProductVariantAllImagesLoader() {
    return new DataLoader<number, ProductVariantImage[]>(
      async (productVariantIds: number[]) => {
        return await this.productVariantsService.getAllImagesForVariantsByBatch(
          productVariantIds,
        );
      },
    );
  }

  private createAttributesByKeyLoader() {
    return new DataLoader<number, Attribute[]>(async (keyIds: number[]) => {
      return await this.productVariantAttributeKeysService.getAllAttributesByBatch(
        keyIds,
      );
    });
  }

  private createProductVariantProductLoader() {
    return new DataLoader<number, Product>(
      async (productVariantIds: number[]) => {
        return await this.productsService.getProductsForVariantsByBatch(
          productVariantIds,
        );
      },
    );
  }

  private createCartItemProductVariantLoader() {
    return new DataLoader<number, ProductVariant | null>(
      async (cartItemIds: number[]) => {
        return await this.cartItemsService.getProductVariantsByBatch(
          cartItemIds,
        );
      },
    );
  }

  private createOrderItemProductVariantLoader() {
    return new DataLoader<number, ProductVariant | null>(
      async (orderItemIds: number[]) => {
        return await this.orderItemsService.getProductVariantsByBatch(
          orderItemIds,
        );
      },
    );
  }

  private createProductVariantsByAttributeIdLoader() {
    return new DataLoader<number, ProductVariant[]>(
      async (attributeIds: number[]) => {
        return await this.productVariantAttributesService.getProductVariantsByBatch(
          attributeIds,
        );
      },
    );
  }

  private createOrderItemProductReviewLoader() {
    return new DataLoader<number, ProductReview | null>(
      async (orderItemIds: number[]) => {
        return await this.orderItemsService.getProductReviewsByBatch(
          orderItemIds,
        );
      },
    );
  }

  private createProductReviewAuthorLoader() {
    return new DataLoader<number, ProductReviewAuthor | null>(
      async (productReviewIds: number[]) => {
        return await this.productReviewService.getReviewAuthorsByProductReviewIds(
          productReviewIds,
        );
      },
    );
  }

  private createProductVariantByProductReviewIdLoader() {
    return new DataLoader<number, ProductVariant | null>(
      async (productReviewIds: number[]) => {
        return await this.productReviewService.getProductVariantsByProductReviewIds(
          productReviewIds,
        );
      },
    );
  }
}
