import { Injectable, Scope } from '@nestjs/common';
import { IDataLoaders } from './dataloader.interface';
import * as DataLoader from 'dataloader';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({
  scope: Scope.REQUEST,
})
export class DataloaderService {
  constructor(private readonly db: PrismaService) {}

  private readonly loaders: Record<
    keyof IDataLoaders,
    DataLoader<any, any> | undefined
  > = {
    subcategoriesLoader: undefined,
  };

  getLoader<K extends keyof IDataLoaders>(loader: K): IDataLoaders[K] {
    if (!this.loaders[loader]) {
      this.loaders[loader] = this._createLoader(loader);
    }
    return this.loaders[loader] as IDataLoaders[K];
  }

  private _createLoader(loader: keyof IDataLoaders) {
    switch (loader) {
      case 'subcategoriesLoader':
        return this._createSubcategoriesLoader();
      default:
        throw new Error(`Loader ${loader as string} not found`);
    }
  }

  private _createSubcategoriesLoader() {
    return new DataLoader<string, Category[]>(async (categoryIds: string[]) => {
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
}
