import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';
import { LocalesService } from 'src/locales/locales.service';
export declare class CategoriesService {
    private readonly prisma;
    private readonly redisService;
    private readonly localeService;
    private readonly CATEGORIES_CACHE_KEY;
    private readonly logger;
    constructor(prisma: PrismaService, redisService: RedisService, localeService: LocalesService);
    create(createCategoryInput: CreateCategoryInput): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentCategoryId: string | null;
    }>;
    private getCategoryCacheKey;
    private invalidateCategoriesCache;
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
    findTranslations(id: string, locale?: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        localeId: string;
        categoryId: string;
    }[]>;
}
