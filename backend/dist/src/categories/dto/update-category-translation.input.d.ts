import { type CategoryTranslation as DbCategoryTranslation } from 'generated/prisma/client';
export declare class UpdateCategoryTranslationInput implements Partial<DbCategoryTranslation> {
    name: string;
    description?: string | null;
    localeCode: string;
}
