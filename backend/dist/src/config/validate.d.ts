import z from 'zod';
declare const envSchema: z.ZodObject<{
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    DATABASE_URL: z.ZodString;
    JWT_ACCESS_SECRET: z.ZodString;
    JWT_REFRESH_SECRET: z.ZodString;
    JWT_ACCESS_EXPIRATION_IN_SECONDS: z.ZodCoercedNumber<unknown>;
    JWT_REFRESH_EXPIRATION_IN_SECONDS: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export type Env = z.infer<typeof envSchema>;
export declare const validateEnv: (config: Record<string, unknown>) => {
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRATION_IN_SECONDS: number;
    JWT_REFRESH_EXPIRATION_IN_SECONDS: number;
};
export {};
