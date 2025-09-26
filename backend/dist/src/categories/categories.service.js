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
const variables_1 = require("../config/variables");
let CategoriesService = CategoriesService_1 = class CategoriesService {
    prisma;
    CATEGORIES_CACHE_KEY = 'app:categories';
    DEFAULT_LANG = variables_1.DEFAULT_LANG;
    logger = new common_1.Logger(CategoriesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCategoryInput) {
        const { translations, ...newCategory } = createCategoryInput;
        const uniqueTranslations = new Map();
        for (const translation of translations) {
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
    async findAll(parentId) {
        if (parentId && parentId.trim() !== '') {
            const categories = await this.prisma.category.findMany({
                where: { parentCategoryId: parentId },
            });
            return categories;
        }
        const categories = await this.prisma.category.findMany({
            where: {
                parentCategoryId: null,
            },
        });
        return categories;
    }
    async findOne(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
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
            throw new common_1.NotFoundException();
        }
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
            await this.prisma.$transaction(async (tx) => {
                await tx.categoryTranslation.deleteMany({
                    where: {
                        categoryId: id,
                    },
                });
                await tx.category.delete({
                    where: { id },
                });
            });
        }
        catch (error) {
            this.logger.error(`Failed to remove category with id ${id}: ${error instanceof Error ? error.message : String(error)}`);
            throw new Error(error);
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
    async findTranslation(categoryId, locale) {
        return this.prisma.categoryTranslation.findFirst({
            where: {
                categoryId: categoryId,
                locale: {
                    code: locale,
                },
            },
        });
    }
    async getAllTranslationsByBatch(lang, categoryIds) {
        const categoryTranslations = await this.prisma.categoryTranslation.findMany({
            where: {
                categoryId: {
                    in: categoryIds,
                },
                locale: {
                    code: {
                        in: [lang, variables_1.DEFAULT_LANG],
                    },
                },
            },
            include: {
                locale: {
                    select: {
                        code: true,
                    },
                },
            },
        });
        return categoryIds.map((id) => {
            const cts = categoryTranslations.filter((ct) => ct.categoryId === id);
            if (cts.length === 0)
                return null;
            return cts.find((ct) => ct.locale.code === lang) || cts[0];
        });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map