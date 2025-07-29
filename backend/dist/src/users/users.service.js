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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt_1 = require("bcrypt");
const library_1 = require("@prisma/client/runtime/library");
let UsersService = UsersService_1 = class UsersService {
    prisma;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserInput) {
        let hashedPassword;
        try {
            hashedPassword = await bcrypt_1.default.hash(createUserInput.password, 10);
        }
        catch (err) {
            this.logger.error('Failed to hash password: ', err);
            throw new common_1.InternalServerErrorException('Failed to hash password');
        }
        try {
            const user = await this.prisma.user.create({
                data: {
                    firstName: createUserInput.name,
                    lastName: createUserInput.lastName,
                    email: createUserInput.email,
                    hashedPassword: hashedPassword,
                },
            });
            this.logger.log(`User created: ${user.id}`);
            return user;
        }
        catch (err) {
            if (err instanceof library_1.PrismaClientKnownRequestError &&
                err.code === 'P2002') {
                throw new common_1.BadRequestException('Email already exists');
            }
            throw new common_1.InternalServerErrorException('Failed to create user');
        }
    }
    async findOneByEmail(email) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            return user;
        }
        catch (err) {
            this.logger.error('Failed to find user by email: ', err);
            throw new common_1.InternalServerErrorException('Something went wrong. Please try again.');
        }
    }
    async update(id, updateUserInput) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: updateUserInput,
                omit: {
                    hashedPassword: true,
                },
            });
            this.logger.log(`User updated: ${user.id}`);
            return user;
        }
        catch (err) {
            if (err instanceof library_1.PrismaClientKnownRequestError &&
                err.code === 'P2002') {
                throw new common_1.BadRequestException('Email already in use');
            }
            this.logger.error('Failed to update user: ', err);
            throw new common_1.InternalServerErrorException('Failed to update user');
        }
    }
    async remove(id) {
        try {
            await this.prisma.user.delete({
                where: { id },
            });
            this.logger.log(`User deleted: ${id}`);
        }
        catch (err) {
            this.logger.error('Failed to delete user: ', err);
            throw new common_1.InternalServerErrorException('Something went wrong. Please try again.');
        }
    }
    async findAll() {
        try {
            const users = await this.prisma.user.findMany({
                omit: {
                    hashedPassword: true,
                },
            });
            return users;
        }
        catch (err) {
            this.logger.error('Failed to find all users: ', err);
            throw new common_1.InternalServerErrorException('Something went wrong. Please try again.');
        }
    }
    async findOne(id) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
                omit: {
                    hashedPassword: true,
                },
            });
            return user;
        }
        catch (err) {
            this.logger.error('Failed to find user: ', err);
            throw new common_1.InternalServerErrorException('Something went wrong. Please try again.');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map