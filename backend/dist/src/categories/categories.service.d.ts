import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category, CategoryTranslation } from '@prisma/client';
export declare class CategoriesService {
    private readonly prisma;
    private readonly CATEGORIES_CACHE_KEY;
    private readonly DEFAULT_LANG;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createCategoryInput: CreateCategoryInput): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentCategoryId: string | null;
    }>;
    private getCategoryCacheKey;
    findAll(parentId?: string): Promise<Category[]>;
    findOne(id: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentCategoryId: string | null;
    } | null>;
    update(id: string, updateCategoryInput: UpdateCategoryInput): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentCategoryId: string | null;
    }>;
    remove(id: string): Promise<void>;
    findAllSubcategoriesByParentIds(parentIds: string[]): Promise<Category[]>;
    getCategorySubcategoriesByBatch(parentIds: string[]): Promise<(Category[] | null)[]>;
    findTranslation(categoryId: string, locale: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        localeId: string;
        categoryId: string;
    } | null>;
    getAllTranslationsByBatch(lang: string, categoryIds: string[]): Promise<(CategoryTranslation | null)[]>;
    findTranslations(id: string, locale?: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        localeId: string;
        categoryId: string;
    }[]>;
}
