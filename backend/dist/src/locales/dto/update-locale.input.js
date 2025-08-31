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
exports.UpdateLocaleInput = void 0;
const class_validator_1 = require("class-validator");
const create_locale_input_1 = require("./create-locale.input");
const graphql_1 = require("@nestjs/graphql");
let UpdateLocaleInput = class UpdateLocaleInput extends (0, graphql_1.PartialType)(create_locale_input_1.CreateLocaleInput) {
    id;
    code;
    name;
    isActive;
};
exports.UpdateLocaleInput = UpdateLocaleInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { description: 'Locale ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateLocaleInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { description: 'Locale code' }),
    (0, class_validator_1.Length)(2, 5, { message: 'Code must be between 2 and 5 characters long.' }),
    __metadata("design:type", String)
], UpdateLocaleInput.prototype, "code", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { description: 'Native locale name' }),
    (0, class_validator_1.Length)(2, 100, {
        message: 'Name must be between 2 and 100 characters long.',
    }),
    __metadata("design:type", String)
], UpdateLocaleInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { description: 'Is the locale active?' }),
    __metadata("design:type", Boolean)
], UpdateLocaleInput.prototype, "isActive", void 0);
exports.UpdateLocaleInput = UpdateLocaleInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateLocaleInput);
//# sourceMappingURL=update-locale.input.js.map