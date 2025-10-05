import DataLoader from 'dataloader';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class CategoriesLoaderService {
    private readonly db;
    constructor(db: PrismaService);
    readonly batchSubcategoriesByParentId: DataLoader<string, {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        parentCategoryId: string | null;
    }[], string>;
}
