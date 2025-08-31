import { Category as CategoryEntity } from '@prisma/client';
import { CategoryTranslation } from './category-translation.entity';
export declare class Category implements CategoryEntity {
    id: string;
    slug: string;
    parentCategoryId: string | null;
    translations: Array<CategoryTranslation>;
    createdAt: Date;
    updatedAt: Date;
}
