import DataLoader from 'dataloader';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class CategoriesLoaderService {
    private readonly db;
    constructor(db: PrismaService);
    readonly batchSubcategoriesByParentId: DataLoader<string, {
        name: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentCategoryId: string | null;
    }[], string>;
}
