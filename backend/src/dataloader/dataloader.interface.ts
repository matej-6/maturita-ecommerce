import { Category, CategoryTranslation } from 'generated/prisma/client';
import DataLoader from 'dataloader';

export interface IDataLoaders {
  subcategoriesLoader: DataLoader<number, Category[]>;
  categoryTranslationLoader: DataLoader<number, CategoryTranslation | null>;
}
