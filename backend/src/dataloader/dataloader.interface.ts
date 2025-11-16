import {
  Category,
  CategoryTranslation,
  ProductTranslation,
} from 'generated/prisma/client';
import DataLoader from 'dataloader';

export interface IDataLoaders {
  subcategoriesLoader: DataLoader<number, Category[]>;
  categoryTranslationLoader: DataLoader<number, CategoryTranslation | null>;
  categoryProductsCountLoader: DataLoader<number, number>;
  productTranslationLoader: DataLoader<number, ProductTranslation | null>;
}
