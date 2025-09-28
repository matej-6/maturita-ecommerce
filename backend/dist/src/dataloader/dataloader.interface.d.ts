import { Category, CategoryTranslation } from 'generated/prisma/client';
import DataLoader from 'dataloader';
export interface IDataLoaders {
    subcategoriesLoader: DataLoader<string, Category[]>;
    categoryTranslationLoader: DataLoader<string, CategoryTranslation | null>;
}
