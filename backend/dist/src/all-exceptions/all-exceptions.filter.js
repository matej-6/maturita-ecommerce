"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const errors_1 = require("../errors");
const exception_body_formatter_1 = require("../lib/exception-body-formatter");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exc, host) {
        console.log('exc', exc);
        const exception = exc instanceof common_1.HttpException
            ? exc
            : new common_1.HttpException(errors_1.ERROR.unknownError, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        const res = (0, exception_body_formatter_1.exceptionBodyFormatter)(host, exception);
        const gqlHost = graphql_1.GqlArgumentsHost.create(host);
        if (gqlHost.getContext() != null)
            return res;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        response.status(exception.getStatus()).json(res);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map