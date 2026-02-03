import { defineConfig } from '@prisma/config';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';

declare const __dirname: string;

loadEnv({ path: resolve(__dirname, '.env') });

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL must be set in primary-backend/.env before running Prisma commands');
}

export default defineConfig({
  datasource: {
    url: DATABASE_URL,
  },
});
