import { type CategoryTranslation as DbCategoryTranslation } from 'generated/prisma/client';
export declare class CreateCategoryTranslationInput implements Partial<DbCategoryTranslation> {
    name: string;
    description?: string;
    localeCode: string;
}
