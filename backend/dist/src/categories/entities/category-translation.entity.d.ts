import { type CategoryTranslation as DbCategoryTranslation } from '@prisma/client';
import { Locale } from 'src/locales/entities/locale.entity';
export declare class CategoryTranslation implements Partial<DbCategoryTranslation> {
    id: string;
    name: string;
    description?: string | null;
    localeId: string;
    categoryId: string;
    locale: Locale;
}
