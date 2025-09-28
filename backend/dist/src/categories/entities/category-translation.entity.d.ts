import { type CategoryTranslation as DbCategoryTranslation } from 'generated/prisma/client';
export declare class CategoryTranslation implements Partial<DbCategoryTranslation> {
    id: string;
    name: string;
    description?: string | null;
    localeId: string;
    categoryId: string;
    locale: string;
    isActive: boolean;
}
