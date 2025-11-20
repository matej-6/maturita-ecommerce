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
} from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoriesService } from 'src/categories/categories.service';
import { I18nContext } from 'nestjs-i18n';
import { DEFAULT_LOCALE } from 'src/locales';
import { ProductsService } from 'src/products/products.service';
import { ProductVariantsService } from 'src/product-variants/product-variants.service';
import { ProductVariantAttributesService } from 'src/product-variant-attributes/product-variant-attributes.service';

import { ProductVariantAttributeKeysService } from 'src/product-variant-attribute-keys/product-variant-attribute-keys.service';

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

    const subcategoriesLoader = this._createSubcategoriesLoader();
    const categoryTranslationLoader =
      this._createCategoryTranslationLoader(locale);
    const categoryProductsCountLoader =
      this._createCategoryProductsCountLoader();
    const productTranslationLoader =
      this._createProductTranslationLoader(locale);
    const productAllTranslationsLoader =
      this._createProductAllTranslationsLoader();
    const productAllVariantsLoader = this._createProductAllVariantsLoader();
    const productVariantAllAttributesLoader =
      this._createProductVariantAllAttributesLoader();
    const attributeKeyByIdLoader = this._createAttributeKeyByIdLoader();
    const attributeKeyTranslationLoader =
      this._createAttributeKeyTranslationLoader(locale);
    const attributeKeyAllTranslationsLoader =
      this._createAttributeKeyAllTranslationsLoader();
    const productVariantAttributeTranslationLoader =
      this._createProductVariantAttributeTranslationLoader(locale);
    const productVariantAttributeAllTranslationsLoader =
      this._createProductVariantAttributeAllTranslationsLoader();
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
    };
  }

  private _createCategoryProductsCountLoader() {
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

  private _createSubcategoriesLoader() {
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

  private _createCategoryTranslationLoader(lang: string) {
    return new DataLoader<number, CategoryTranslation | null>(
      async (categoryIds: number[]) => {
        return await this.categoriesService.getAllTranslationsByBatch(
          lang,
          categoryIds,
        );
      },
    );
  }

  private _createProductTranslationLoader(lang: string) {
    return new DataLoader<number, ProductTranslation | null>(
      async (productIds: number[]) => {
        return await this.productsService.getAllTranslationsByBatch(
          lang,
          productIds,
        );
      },
    );
  }

  private _createProductAllTranslationsLoader() {
    return new DataLoader<number, ProductTranslation[]>(
      async (productIds: number[]) => {
        return await this.productsService.getAllTranslationsForProductsByBatch(
          productIds,
        );
      },
    );
  }

  private _createProductAllVariantsLoader() {
    return new DataLoader<number, ProductVariant[]>(
      async (productIds: number[]) => {
        return await this.productsService.getAllVariantsForProductsByBatch(
          productIds,
        );
      },
    );
  }

  private _createProductVariantAllAttributesLoader() {
    return new DataLoader<number, Attribute[]>(
      async (productVariantIds: number[]) => {
        return await this.productVariantsService.getAllAttributesForVariantsByBatch(
          productVariantIds,
        );
      },
    );
  }

  private _createAttributeKeyByIdLoader() {
    return new DataLoader<number, AttributeKey | null>(
      async (attributeIds: number[]) => {
        return await this.productVariantAttributesService.getAttributeKeysByBatch(
          attributeIds,
        );
      },
    );
  }

  private _createAttributeKeyTranslationLoader(lang: string) {
    return new DataLoader<number, AttributeKeyTranslation | null>(
      async (attributeKeyIds: number[]) => {
        return await this.productVariantAttributeKeysService.getTranslationsByBatch(
          lang,
          attributeKeyIds,
        );
      },
    );
  }

  private _createAttributeKeyAllTranslationsLoader() {
    return new DataLoader<number, AttributeKeyTranslation[]>(
      async (attributeKeyIds: number[]) => {
        return await this.productVariantAttributeKeysService.getAllTranslationsByBatch(
          attributeKeyIds,
        );
      },
    );
  }

  private _createProductVariantAttributeTranslationLoader(lang: string) {
    return new DataLoader<number, AttributeTranslation | null>(
      async (attributeIds: number[]) => {
        return await this.productVariantAttributesService.getTranslationsByBatch(
          lang,
          attributeIds,
        );
      },
    );
  }

  private _createProductVariantAttributeAllTranslationsLoader() {
    return new DataLoader<number, AttributeTranslation[]>(
      async (attributeIds: number[]) => {
        return await this.productVariantAttributesService.getAllTranslationsByBatch(
          attributeIds,
        );
      },
    );
  }
}
