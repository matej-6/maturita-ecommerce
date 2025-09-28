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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataloaderService = void 0;
const common_1 = require("@nestjs/common");
const DataLoader = require("dataloader");
const prisma_service_1 = require("../prisma/prisma.service");
const categories_service_1 = require("../categories/categories.service");
const nestjs_i18n_1 = require("nestjs-i18n");
const locales_1 = require("../locales");
let DataloaderService = class DataloaderService {
    db;
    categoriesService;
    constructor(db, categoriesService) {
        this.db = db;
        this.categoriesService = categoriesService;
    }
    getLoaders() {
        const subcategoriesLoader = this._createSubcategoriesLoader();
        const categoryTranslationLoader = this._createCategoryTranslationLoader(nestjs_i18n_1.I18nContext.current()?.lang || locales_1.DEFAULT_LOCALE.code);
        return {
            subcategoriesLoader,
            categoryTranslationLoader,
        };
    }
    _createSubcategoriesLoader() {
        return new DataLoader(async (categoryIds) => {
            const subcategories = await this.db.category.findMany({
                where: {
                    parentCategoryId: {
                        in: categoryIds,
                    },
                },
            });
            return categoryIds.map((id) => subcategories.filter((subc) => subc.parentCategoryId === id));
        });
    }
    _createCategoryTranslationLoader(lang) {
        return new DataLoader(async (categoryIds) => {
            return await this.categoriesService.getAllTranslationsByBatch(lang, categoryIds);
        });
    }
};
exports.DataloaderService = DataloaderService;
exports.DataloaderService = DataloaderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        categories_service_1.CategoriesService])
], DataloaderService);
//# sourceMappingURL=dataloader.service.js.map