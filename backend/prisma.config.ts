import { config } from 'dotenv';

import path from 'node:path';
import type { PrismaConfig } from 'prisma';

config({
  path: path.join(__dirname, `.env`),
});

export default {
  schema: path.join('prisma'),
} satisfies PrismaConfig;
