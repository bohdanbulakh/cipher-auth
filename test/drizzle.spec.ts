import { Test, TestingModule } from '@nestjs/testing';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { SecurityConfigService } from '../src/config/security-config.service';
import { drizzleProvider } from '../src/database/drizzle';
import { schema } from '../src/database/schema';

jest.mock('pg', () => ({
  Pool: jest.fn(() => ({
    connect: jest.fn(),
    end: jest.fn(),
  })),
}));

jest.mock('drizzle-orm/node-postgres', () => ({
  drizzle: jest.fn(() => ({})),
}));

describe('DrizzleProvider', () => {
  let configService: SecurityConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...drizzleProvider,
        {
          provide: SecurityConfigService,
          useValue: {
            databaseUrl: 'postgres://user:pass@localhost:5432/db',
          },
        },
      ],
    }).compile();

    configService = module.get<SecurityConfigService>(SecurityConfigService);
  });

  it('should create drizzle instance with valid config', () => {
    const pool = new Pool({ connectionString: configService.databaseUrl });
    drizzle(pool, { schema });

    expect(Pool).toHaveBeenCalledWith({
      connectionString: 'postgres://user:pass@localhost:5432/db',
    });
    expect(drizzle).toHaveBeenCalledWith(pool, { schema });
  });
});
