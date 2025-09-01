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
exports.CreateCategoryTranslationInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const nestjs_i18n_1 = require("nestjs-i18n");
let CreateCategoryTranslationInput = class CreateCategoryTranslationInput {
    name;
    description;
    localeCode;
};
exports.CreateCategoryTranslationInput = CreateCategoryTranslationInput;
__decorate([
    (0, graphql_1.Field)(() => String, { description: 'Category name' }),
    (0, class_validator_1.MinLength)(3, { message: (0, nestjs_i18n_1.i18nValidationMessage)('validation.minLength') }),
    (0, class_validator_1.MaxLength)(255, { message: (0, nestjs_i18n_1.i18nValidationMessage)('validation.maxLength') }),
    __metadata("design:type", String)
], CreateCategoryTranslationInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { description: 'Category description', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(4000, {
        message: (0, nestjs_i18n_1.i18nValidationMessage)('validation.maxLength'),
    }),
    __metadata("design:type", Object)
], CreateCategoryTranslationInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { description: 'Locale code' }),
    (0, class_validator_1.IsString)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('validation.required') }),
    (0, class_validator_1.MinLength)(2, { message: (0, nestjs_i18n_1.i18nValidationMessage)('validation.minLength') }),
    (0, class_validator_1.MaxLength)(5, { message: (0, nestjs_i18n_1.i18nValidationMessage)('validation.maxLength') }),
    __metadata("design:type", String)
], CreateCategoryTranslationInput.prototype, "localeCode", void 0);
exports.CreateCategoryTranslationInput = CreateCategoryTranslationInput = __decorate([
    (0, graphql_1.InputType)()
], CreateCategoryTranslationInput);
//# sourceMappingURL=create-category-translation.input.js.map