import 'dotenv/config';
import path from 'node:path';
import type { PrismaConfig } from 'prisma';

export default {
  schema: path.join('prisma'),
  migrations: {
    seed: 'bun prisma/seed/seed.ts',
  },
} satisfies PrismaConfig;
