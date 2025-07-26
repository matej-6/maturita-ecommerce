"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.default.object({
    PORT: zod_1.default.coerce.number().default(3000),
    NODE_ENV: zod_1.default
        .enum(['development', 'production', 'test'])
        .default('development'),
    DATABASE_URL: zod_1.default.string(),
    JWT_ACCESS_SECRET: zod_1.default.string(),
    JWT_REFRESH_SECRET: zod_1.default.string(),
    JWT_ACCESS_EXPIRATION_IN_SECONDS: zod_1.default.coerce.number(),
    JWT_REFRESH_EXPIRATION_IN_SECONDS: zod_1.default.coerce.number(),
});
const validateEnv = (config) => {
    const result = envSchema.safeParse(config);
    if (!result.success) {
        throw new Error(`Invalid environment variables: ${result.error.message}`);
    }
    return result.data;
};
exports.validateEnv = validateEnv;
//# sourceMappingURL=validate.js.map