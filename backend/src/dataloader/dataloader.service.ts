import { Injectable } from '@nestjs/common';
import { IDataLoaders } from './dataloader.interface';
import * as DataLoader from 'dataloader';
import { Category, CategoryTranslation } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoriesService } from 'src/categories/categories.service';
import { I18nContext } from 'nestjs-i18n';
import { DEFAULT_LOCALE } from 'src/locales';

@Injectable()
export class DataloaderService {
  constructor(
    private readonly db: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) {}

  getLoaders(): IDataLoaders {
    const subcategoriesLoader = this._createSubcategoriesLoader();
    const categoryTranslationLoader = this._createCategoryTranslationLoader(
      I18nContext.current()?.lang || DEFAULT_LOCALE.code,
    );

    return {
      subcategoriesLoader,
      categoryTranslationLoader,
    };
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
}
