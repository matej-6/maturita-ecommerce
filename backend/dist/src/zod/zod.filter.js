"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodFilter = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
let ZodFilter = class ZodFilter {
    catch(exception, host) {
        if (host.getType() === 'http') {
            const ctx = host.switchToHttp();
            const res = ctx.getResponse();
            const status = common_1.HttpStatus.BAD_REQUEST;
            const message = zod_1.default.prettifyError(exception);
            res.status(status).json({
                message: message,
                status: status,
                extensions: {
                    code: 'BAD_REQUEST',
                    message: message,
                },
            });
            return;
        }
        else if (host.getType() === 'graphql') {
            throw new Error(JSON.stringify({
                message: exception.message,
                status: common_1.HttpStatus.BAD_REQUEST,
                errors: exception.issues.map((issue) => issue.message),
            }));
        }
        throw exception;
    }
};
exports.ZodFilter = ZodFilter;
exports.ZodFilter = ZodFilter = __decorate([
    (0, common_1.Catch)(zod_1.ZodError)
], ZodFilter);
//# sourceMappingURL=zod.filter.js.map