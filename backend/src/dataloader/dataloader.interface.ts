import { Category, CategoryTranslation } from '@prisma/client';
import DataLoader from 'dataloader';

export interface IDataLoaders {
  subcategoriesLoader: DataLoader<string, Category[]>;
  categoryTranslationLoader: DataLoader<string, CategoryTranslation | null>;
}
