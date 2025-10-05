import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category, CategoryTranslation } from 'generated/prisma/client';
import { LocalesService } from 'src/locales/locales.service';
export declare class CategoriesService {
    private readonly prisma;
    private readonly localesService;
    private readonly CATEGORIES_CACHE_KEY;
    private readonly logger;
    constructor(prisma: PrismaService, localesService: LocalesService);
    create(createCategoryInput: CreateCategoryInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        parentCategoryId: string | null;
    }>;
    private getCategoryCacheKey;
    findAll(parentId?: string | null): Promise<Category[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        parentCategoryId: string | null;
    } | null>;
    update(id: string, updateCategoryInput: UpdateCategoryInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        parentCategoryId: string | null;
    }>;
    remove(id: string): Promise<void>;
    findAllSubcategoriesByParentIds(parentIds: string[]): Promise<Category[]>;
    getCategorySubcategoriesByBatch(parentIds: string[]): Promise<(Category[] | null)[]>;
    findTranslation(categoryId: string, locale: string): Promise<{
        name: string;
        id: string;
        locale: string;
        description: string | null;
        isActive: boolean;
        categoryId: string;
    } | null>;
    getAllTranslationsByBatch(lang: string, categoryIds: string[]): Promise<(CategoryTranslation | null)[]>;
    findTranslations(id: string, locales?: string[]): Promise<{
        name: string;
        id: string;
        locale: string;
        description: string | null;
        isActive: boolean;
        categoryId: string;
    }[]>;
}
