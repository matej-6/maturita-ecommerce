import z from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION_IN_SECONDS: z.coerce.number(),
  JWT_REFRESH_EXPIRATION_IN_SECONDS: z.coerce.number(),
  REDIS_URL: z.string(),
  STRIPE_API_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  NEXTJS_URL: z.string(),
  OLLAMA_BASE_URL: z.string().optional(),
  OLLAMA_LLM_MODEL: z.string().optional(),
  OLLAMA_EMBEDDING_MODEL: z.string().optional(),
  OLLAMA_EMBEDDING_MODEL_DIMENSION: z.coerce.number().optional(),
  QDRANT_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>) => {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    throw new Error(`Invalid environment variables: ${result.error.message}`);
  }

  return result.data;
};
