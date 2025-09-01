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
exports.CreateCategoryInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const create_category_translation_input_1 = require("./create-category-translation.input");
const contains_english_translation_constraint_1 = require("../validators/contains-english-translation.constraint");
const nestjs_i18n_1 = require("nestjs-i18n");
let CreateCategoryInput = class CreateCategoryInput {
    slug;
    parentCategoryId;
    translations;
};
exports.CreateCategoryInput = CreateCategoryInput;
__decorate([
    (0, graphql_1.Field)(() => String, { description: 'Slug of the category' }),
    (0, class_validator_1.IsString)({ message: (0, nestjs_i18n_1.i18nValidationMessage)('validation.required') }),
    (0, class_validator_1.MinLength)(3, { message: (0, nestjs_i18n_1.i18nValidationMessage)('validation.minLength') }),
    (0, class_validator_1.MaxLength)(255, { message: (0, nestjs_i18n_1.i18nValidationMessage)('validation.maxLength') }),
    __metadata("design:type", String)
], CreateCategoryInput.prototype, "slug", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, {
        description: 'Parent category id',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(undefined, { message: (0, nestjs_i18n_1.i18nValidationMessage)('validation.invalid') }),
    __metadata("design:type", String)
], CreateCategoryInput.prototype, "parentCategoryId", void 0);
__decorate([
    (0, graphql_1.Field)(() => [create_category_translation_input_1.CreateCategoryTranslationInput], {
        description: 'Category translations',
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(1, {
        message: (0, nestjs_i18n_1.i18nValidationMessage)('validation.field.translation.minLength'),
    }),
    (0, contains_english_translation_constraint_1.ContainsEnglishTranslation)({
        message: (0, nestjs_i18n_1.i18nValidationMessage)('validation.field.translation.englishRequired'),
    }),
    __metadata("design:type", Array)
], CreateCategoryInput.prototype, "translations", void 0);
exports.CreateCategoryInput = CreateCategoryInput = __decorate([
    (0, graphql_1.InputType)()
], CreateCategoryInput);
//# sourceMappingURL=create-category.input.js.map