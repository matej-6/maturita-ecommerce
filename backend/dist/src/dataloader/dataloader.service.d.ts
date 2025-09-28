import { IDataLoaders } from './dataloader.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoriesService } from 'src/categories/categories.service';
export declare class DataloaderService {
    private readonly db;
    private readonly categoriesService;
    constructor(db: PrismaService, categoriesService: CategoriesService);
    getLoaders(): IDataLoaders;
    private _createSubcategoriesLoader;
    private _createCategoryTranslationLoader;
}
