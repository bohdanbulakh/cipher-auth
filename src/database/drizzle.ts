import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { SecurityConfigService } from '../config/security-config.service';
import { Provider } from '@nestjs/common';

export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';

export const drizzleProvider: Provider[] = [
  {
    provide: DrizzleAsyncProvider,
    inject: [SecurityConfigService],
    useFactory: (configService: SecurityConfigService) => {
      const connectionString = configService.databaseUrl;
      if (!connectionString) throw new Error('DATABASE_URL missing');

      const pool = new Pool({
        connectionString,
      });

      return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
    },
  },
];
