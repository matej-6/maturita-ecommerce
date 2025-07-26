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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const categories_service_1 = require("./categories.service");
const category_entity_1 = require("./entities/category.entity");
const create_category_input_1 = require("./dto/create-category.input");
const update_category_input_1 = require("./dto/update-category.input");
let CategoriesResolver = class CategoriesResolver {
    categoriesService;
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    createCategory(createCategoryInput) {
        return this.categoriesService.create(createCategoryInput);
    }
    findAll() {
        return this.categoriesService.findAll();
    }
    findOne(id) {
        return this.categoriesService.findOne(id);
    }
    updateCategory(updateCategoryInput) {
        return this.categoriesService.update(updateCategoryInput.id, updateCategoryInput);
    }
    removeCategory(id) {
        return this.categoriesService.remove(id);
    }
    async subcategories(category, ctx) {
        const { dataLoaderService } = ctx;
        const { id } = category;
        return dataLoaderService.getLoader('subcategoriesLoader').load(id);
    }
};
exports.CategoriesResolver = CategoriesResolver;
__decorate([
    (0, graphql_1.Mutation)(() => category_entity_1.Category),
    __param(0, (0, graphql_1.Args)('createCategoryInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_input_1.CreateCategoryInput]),
    __metadata("design:returntype", void 0)
], CategoriesResolver.prototype, "createCategory", null);
__decorate([
    (0, graphql_1.Query)(() => [category_entity_1.Category], { name: 'categories' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriesResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => category_entity_1.Category, { name: 'category' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Mutation)(() => category_entity_1.Category),
    __param(0, (0, graphql_1.Args)('updateCategoryInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_category_input_1.UpdateCategoryInput]),
    __metadata("design:returntype", void 0)
], CategoriesResolver.prototype, "updateCategory", null);
__decorate([
    (0, graphql_1.Mutation)(() => category_entity_1.Category),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesResolver.prototype, "removeCategory", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [category_entity_1.Category], { name: 'subcategories' }),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_entity_1.Category, Object]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "subcategories", null);
exports.CategoriesResolver = CategoriesResolver = __decorate([
    (0, graphql_1.Resolver)(() => category_entity_1.Category),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesResolver);
//# sourceMappingURL=categories.resolver.js.map