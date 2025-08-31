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
exports.LocalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LocalesService = class LocalesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createLocaleInput) {
        return this.prisma.locale.create({
            data: createLocaleInput,
        });
    }
    findAll(page = 1, take = 10) {
        if (take < 10)
            take = 10;
        if (take > 100)
            take = 100;
        if (page < 1)
            page = 1;
        return this.prisma.locale.findMany({
            take: 10,
            skip: (page - 1) * 10,
        });
    }
    findOne(id) {
        return this.prisma.locale.findUnique({
            where: { id },
        });
    }
    findByLocaleCode(localeCode) {
        return this.prisma.locale.findUnique({
            where: { code: localeCode },
        });
    }
    update(id, updateLocaleInput) {
        return this.prisma.locale.update({
            where: {
                id,
            },
            data: updateLocaleInput,
        });
    }
    remove(id) {
        return this.prisma.locale.delete({
            where: { id },
        });
    }
};
exports.LocalesService = LocalesService;
exports.LocalesService = LocalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocalesService);
//# sourceMappingURL=locales.service.js.map