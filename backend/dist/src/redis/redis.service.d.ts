import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
export declare class RedisService {
    private readonly configService;
    private redisClient;
    private readonly logger;
    constructor(configService: ConfigService);
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<string | null>;
    get client(): Awaited<ReturnType<typeof createClient>>;
}
