import { Category as CategoryEntity } from 'generated/prisma/client';
import { CategoryTranslation } from './category-translation.entity';
export declare class Category implements CategoryEntity {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    parentCategoryId: string | null;
    translations: Array<CategoryTranslation>;
    createdAt: Date;
    updatedAt: Date;
}
