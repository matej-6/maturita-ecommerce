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
exports.UpdateCategoryTranslationInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let UpdateCategoryTranslationInput = class UpdateCategoryTranslationInput {
    name;
    description;
    localeCode;
};
exports.UpdateCategoryTranslationInput = UpdateCategoryTranslationInput;
__decorate([
    (0, graphql_1.Field)(() => String, { description: 'Category name' }),
    (0, class_validator_1.MinLength)(3, { message: 'Name must be at least 3 characters long' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Name must be at most 255 characters long' }),
    __metadata("design:type", String)
], UpdateCategoryTranslationInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { description: 'Category description', nullable: true }),
    (0, class_validator_1.MaxLength)(4000, {
        message: 'Description must be at most 4000 characters long',
    }),
    __metadata("design:type", Object)
], UpdateCategoryTranslationInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { description: 'Locale code' }),
    (0, class_validator_1.IsString)({ message: 'Locale code must be a string' }),
    (0, class_validator_1.Length)(2, 5, { message: 'Locale code must be between 2 and 5 characters' }),
    __metadata("design:type", String)
], UpdateCategoryTranslationInput.prototype, "localeCode", void 0);
exports.UpdateCategoryTranslationInput = UpdateCategoryTranslationInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateCategoryTranslationInput);
//# sourceMappingURL=update-category-translation.input.js.map