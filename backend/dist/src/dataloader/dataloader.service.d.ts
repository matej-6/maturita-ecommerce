import { IDataLoaders } from './dataloader.interface';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class DataloaderService {
    private readonly db;
    constructor(db: PrismaService);
    private readonly loaders;
    getLoader<K extends keyof IDataLoaders>(loader: K): IDataLoaders[K];
    private _createLoader;
    private _createSubcategoriesLoader;
}
