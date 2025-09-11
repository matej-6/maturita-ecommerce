"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralFilter = void 0;
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
let GeneralFilter = class GeneralFilter {
    catch(exception, host) {
        const i18n = nestjs_i18n_1.I18nContext.current(host);
        const ctx = host.switchToHttp();
        console.log(exception);
        let message;
        let errors = [];
        if (exception instanceof nestjs_i18n_1.I18nValidationException) {
            errors = exception.errors;
        }
        else {
            message = i18n?.t(`error.${exception.message}`);
        }
        const response = ctx.getResponse();
        response.json({
            message,
            status: exception.getResponse(),
            errors,
        });
    }
};
exports.GeneralFilter = GeneralFilter;
exports.GeneralFilter = GeneralFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], GeneralFilter);
//# sourceMappingURL=general.filter.js.map