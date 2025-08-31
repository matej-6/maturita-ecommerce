import { type CategoryTranslation as DbCategoryTranslation } from '@prisma/client';
export declare class CreateCategoryTranslationInput implements Partial<DbCategoryTranslation> {
    name: string;
    description?: string | null;
    localeCode: string;
}
