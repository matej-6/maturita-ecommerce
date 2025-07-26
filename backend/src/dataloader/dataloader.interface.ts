import { Category } from '@prisma/client';
import DataLoader from 'dataloader';

export interface IDataLoaders {
  subcategoriesLoader: DataLoader<string, Category[]>;
}
