import { defineConfig } from 'drizzle-kit';
import * as process from 'node:process';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error('DATABASE_URL missing');

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/entities',
  dbCredentials: {
    url: dbUrl,
  },
  migrations: {
    schema: 'public',
  },
});
