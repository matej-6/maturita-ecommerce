"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CategoriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const locales_service_1 = require("../locales/locales.service");
let CategoriesService = CategoriesService_1 = class CategoriesService {
    prisma;
    redisService;
    localeService;
    CATEGORIES_CACHE_KEY = 'app:categories';
    logger = new common_1.Logger(CategoriesService_1.name);
    constructor(prisma, redisService, localeService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.localeService = localeService;
    }
    async create(createCategoryInput) {
        const { translations, ...newCategory } = createCategoryInput;
        const uniqueTranslations = new Map();
        for (const translation of translations) {
            if (uniqueTranslations.has(translation.localeCode)) {
                throw new Error(`Duplicate translation found for locale: ${translation.localeCode}`);
            }
            uniqueTranslations.set(translation.localeCode, translation);
        }
        return this.prisma.category.create({
            data: {
                ...newCategory,
                CategoryTranslation: {
                    create: Array.from(uniqueTranslations.values()).map((t) => ({
                        name: t.name,
                        description: t.description,
                        locale: {
                            connect: {
                                code: t.localeCode,
                            },
                        },
                    })),
                },
            },
        });
    }
    getCategoryCacheKey(id) {
        return `${this.CATEGORIES_CACHE_KEY}:${id}`;
    }
    async invalidateCategoriesCache(id, parentCategoryId) {
        const findAllCategoriesKey = this.CATEGORIES_CACHE_KEY +
            (parentCategoryId ? `:${parentCategoryId}` : '');
        await this.redisService.client.del(findAllCategoriesKey);
        await this.redisService.client.del(this.getCategoryCacheKey(id));
    }
    async findAll(parentId) {
        if (parentId && parentId.trim() !== '') {
            const cachedCategories = await this.redisService.client.get(this.getCategoryCacheKey(parentId));
            if (cachedCategories) {
                try {
                    return JSON.parse(cachedCategories);
                }
                catch (error) {
                    this.logger.error(`Failed to parse cached categories for parentId ${parentId}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
            const categories = await this.prisma.category.findMany({
                where: { parentCategoryId: parentId },
            });
            await this.redisService.client.set(this.getCategoryCacheKey(parentId), JSON.stringify(categories), {
                expiration: {
                    type: 'EX',
                    value: 60 * 60 * 24,
                },
            });
            return categories;
        }
        const cachedCategories = await this.redisService.client.get(this.CATEGORIES_CACHE_KEY);
        if (cachedCategories) {
            try {
                return JSON.parse(cachedCategories);
            }
            catch (error) {
                this.logger.error(`Failed to parse cached categories: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        const categories = await this.prisma.category.findMany();
        await this.redisService.client.set(this.CATEGORIES_CACHE_KEY, JSON.stringify(categories), {
            expiration: {
                type: 'EX',
                value: 60 * 60 * 24,
            },
        });
        return categories;
    }
    async findOne(id) {
        const cachedCategory = await this.redisService.client.get(this.getCategoryCacheKey(id));
        if (cachedCategory) {
            try {
                return JSON.parse(cachedCategory);
            }
            catch (error) {
                this.logger.error(`Failed to parse cached category for id ${id}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (category) {
            await this.redisService.client.set(this.getCategoryCacheKey(id), JSON.stringify(category), {
                expiration: {
                    type: 'EX',
                    value: 60 * 60 * 24,
                },
            });
        }
        return category;
    }
    async update(id, updateCategoryInput) {
        const currentCategory = await this.prisma.category.findUnique({
            where: { id },
            select: {
                id: true,
                parentCategoryId: true,
            },
        });
        if (!currentCategory) {
            throw new common_1.NotFoundException('Category not found');
        }
        await this.invalidateCategoriesCache(id, currentCategory.parentCategoryId);
        return this.prisma.category.update({
            where: { id },
            data: {
                slug: updateCategoryInput.slug,
                parentCategoryId: updateCategoryInput.parentCategoryId,
            },
        });
    }
    async remove(id) {
        try {
            const res = await this.prisma.category.delete({
                where: { id },
            });
            await this.invalidateCategoriesCache(res.id, res.parentCategoryId);
        }
        catch (error) {
            this.logger.error(`Failed to remove category with id ${id}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async findAllSubcategoriesByParentIds(parentIds) {
        return await this.prisma.category.findMany({
            where: {
                parentCategoryId: {
                    in: parentIds,
                },
            },
        });
    }
    async getCategorySubcategoriesByBatch(parentIds) {
        const categories = await this.findAllSubcategoriesByParentIds(parentIds);
        return parentIds.map((parentId) => categories.filter((category) => category.parentCategoryId === parentId) || null);
    }
    async findTranslations(id, locale) {
        if (!locale) {
            return await this.prisma.categoryTranslation.findMany({
                where: {
                    categoryId: id,
                },
            });
        }
        const translations = await this.prisma.categoryTranslation.findMany({
            where: {
                categoryId: id,
                locale: {
                    code: {
                        in: [locale, 'en'],
                    },
                },
            },
            include: {
                locale: true,
            },
        });
        if (translations.length === 0) {
            throw new common_1.NotFoundException(`Translations not found for category with id ${id}`);
        }
        return (translations.filter((translation) => translation.locale.code === locale) ||
            translations.filter((translation) => translation.locale.code === 'en'));
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = CategoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        locales_service_1.LocalesService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map