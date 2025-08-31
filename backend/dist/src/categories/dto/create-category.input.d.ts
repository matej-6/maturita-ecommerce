import { CreateCategoryTranslationInput } from './create-category-translation.input';
export declare class CreateCategoryInput {
    slug: string;
    parentCategoryId?: string;
    translations: CreateCategoryTranslationInput[];
}
