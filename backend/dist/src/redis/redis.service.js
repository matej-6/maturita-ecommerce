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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const redis_1 = require("redis");
let RedisService = RedisService_1 = class RedisService {
    configService;
    redisClient;
    logger = new common_1.Logger(RedisService_1.name);
    onModuleInit() {
        this.logger.log('Initializing Redis client...');
        const redisDatabase = this.configService.get('REDIS_DATABASE');
        (0, redis_1.createClient)({
            username: this.configService.getOrThrow('REDIS_USERNAME'),
            password: this.configService.getOrThrow('REDIS_PASSWORD'),
            socket: {
                host: this.configService.getOrThrow('REDIS_HOST'),
                port: this.configService.getOrThrow('REDIS_PORT'),
            },
            ...(redisDatabase ? { database: redisDatabase } : {}),
        })
            .connect()
            .then((client) => {
            this.redisClient = client;
            client.on('error', (err) => {
                this.logger.error(err);
            });
        })
            .catch((err) => {
            this.logger.error(err);
        });
    }
    async onModuleDestroy() {
        this.logger.log('Disconnecting Redis client...');
        await this.redisClient.quit();
    }
    constructor(configService) {
        this.configService = configService;
    }
    async get(key) {
        return this.redisClient.get(key);
    }
    async set(key, value) {
        return this.redisClient.set(key, value);
    }
    get client() {
        return this.redisClient;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map