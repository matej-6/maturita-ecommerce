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
exports.CategoriesLoaderService = void 0;
const common_1 = require("@nestjs/common");
const dataloader_1 = require("dataloader");
const prisma_service_1 = require("../../prisma/prisma.service");
let CategoriesLoaderService = class CategoriesLoaderService {
    db;
    constructor(db) {
        this.db = db;
    }
    batchSubcategoriesByParentId = new dataloader_1.default(async (categoryIds) => {
        const subcategories = await this.db.category.findMany({
            where: {
                parentCategoryId: {
                    in: categoryIds,
                },
            },
        });
        return categoryIds.map((id) => subcategories.filter((subc) => subc.parentCategoryId === id));
    });
};
exports.CategoriesLoaderService = CategoriesLoaderService;
exports.CategoriesLoaderService = CategoriesLoaderService = __decorate([
    (0, common_1.Injectable)({
        scope: common_1.Scope.REQUEST,
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesLoaderService);
//# sourceMappingURL=categories.loader.service.js.map