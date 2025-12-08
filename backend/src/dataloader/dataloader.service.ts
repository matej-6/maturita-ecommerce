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

@Injectable()
export class DataloaderService {
  constructor(
    private readonly db: PrismaService,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
    private readonly productVariantsService: ProductVariantsService,
    private readonly productVariantAttributesService: ProductVariantAttributesService,
    private readonly productVariantAttributeKeysService: ProductVariantAttributeKeysService,
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
      const subcategories = await this.db.category.findMany({
        where: {
          parentCategoryId: {
            in: categoryIds,
          },
        },
      });

      return categoryIds.map((id) =>
        subcategories.filter((subc) => subc.parentCategoryId === id),
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
    return new DataLoader<number, ProductImage[]>(
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
        return await this.productVariantsService.getProductsForVariantsByBatch(
          productVariantIds,
        );
      },
    );
  }
}
