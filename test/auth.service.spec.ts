import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/modules/auth/auth.service';
import { DrizzleAsyncProvider } from '../src/database/drizzle';
import { SecurityConfigService } from '../src/config/security-config.service';
import { RedisService } from '../src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../src/modules/auth/dto/create-user.dto';
import { UsersSelect } from '../src/database/entities/user.entity';
import { UserResponse } from '../src/modules/auth/responses/user.response';

const mockDrizzle = {
  insert: () => ({
    values: (data: object) => ({
      returning: () => Promise.resolve([{ ...data, id: 'test-id' }]),
    }),
  }),
  query: {
    users: {
      findFirst: jest.fn(),
    },
  },
};

const mockConfigService = {
  accessTtl: '7d',
  accessSecret: 'strong-secret',
};

const mockRedisService = {
  saveUser (token: string, user: UserResponse, expires?: number) {},
};

const testUser: CreateUserDto = {
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  password: 'password123',
};

const dbUser: Omit<UsersSelect, 'password'> = {
  id: 'test-id',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
};

describe('Auth Service', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: DrizzleAsyncProvider,
          useValue: mockDrizzle,
        },
        {
          provide: SecurityConfigService,
          useValue: mockConfigService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    authService = app.get(AuthService);
    jwtService = app.get(JwtService);
  });

  describe('create', () => {
    it('should return created user', async () => {
      const result = await authService.createUser(testUser);
      expect(result).toEqual(dbUser);
    });
  });

  describe('hashPassword', () => {
    it('should return hash not equal to password', () => {
      const password = 'password123';
      expect(authService.hashPassword(password)).not.toEqual(password);
    });
  });

  describe('checkIfUserIsRegistered', () => {
    it('should return true if user exists', async () => {
      expect(await authService.checkIfUserIsRegistered(testUser.username))
        .toEqual(false);
    });

    it('should throw AlreadyRegisteredException', async () => {
      mockDrizzle.query.users.findFirst.mockResolvedValueOnce({
        id: 'existing-id',
        username: 'testuser',
      });

      expect(await authService.checkIfUserIsRegistered(testUser.username))
        .toEqual(true);
    });
  });

  describe('generateToken', () => {
    it('should return valid jwt token', () => {
      const token = authService.generateToken(dbUser);
      const decoded = jwtService.decode(token);

      expect(decoded['sub']).toEqual(dbUser.id);
    });
  });

  describe('getTokenExpTime', () => {
    it('should return token exp time in seconds', () => {
      const token = jwtService.sign(
        { sub: dbUser.id },
        {
          expiresIn: '60m',
          secret: mockConfigService.accessSecret,
        },
      );

      const ex = jwtService.decode(token)['exp'] as number;
      expect(authService.getTokenExpTime(token, 's')).toEqual(ex);
    });

    it('should return token exp time in milliseconds', () => {
      const token = jwtService.sign(
        { sub: dbUser.id },
        {
          expiresIn: '60m',
          secret: mockConfigService.accessSecret,
        },
      );

      const ex = jwtService.decode(token)['exp'] as number;
      expect(authService.getTokenExpTime(token, 'ms')).toEqual(ex * 1000);
      expect(authService.getTokenExpTime(token)).toEqual(ex * 1000);
    });
  });

  describe('login', () => {
    it('should return jwt token', async () => {
      const token = jwtService.sign(
        { sub: dbUser.id },
        {
          expiresIn: '60m',
          secret: mockConfigService.accessSecret,
        },
      );

      jest.spyOn(authService, 'generateToken').mockReturnValueOnce(token);
      expect(await authService.login(dbUser)).toEqual(token);
    });
  });
});
