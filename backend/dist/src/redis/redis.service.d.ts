import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private redisClient;
    private readonly logger;
    onModuleInit(): void;
    onModuleDestroy(): Promise<void>;
    constructor(configService: ConfigService);
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<string | null>;
    get client(): Awaited<ReturnType<typeof createClient>>;
}
