import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../src/redis/redis.service';
import { RedisRepository } from '../src/redis/redis.repository';
import { UsersSelect } from '../src/database/entities/user.entity';

const dbUser: Omit<UsersSelect, 'password'> = {
  id: 'test-id',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
};

const mockRedisRepository = {
  get: () => {},
  set: () => {},
};

describe('RedisService', () => {
  let redisService: RedisService;
  let redisRepository: RedisRepository;

  beforeAll(async () => {

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        RedisRepository,
        {
          provide: RedisRepository,
          useValue: mockRedisRepository,
        },
      ],
    }).compile();

    redisRepository = app.get(RedisRepository);
    redisService = app.get(RedisService);
  });

  describe('getUser', () => {
    it('should return user by token', async () => {
      const token = 'test-token';

      jest.spyOn(redisRepository, 'get')
        .mockImplementationOnce(() => Promise.resolve(JSON.stringify(dbUser)));

      expect(await redisService.getUser(token)).toEqual(dbUser);
    });

    it('should return undefined if no token was found', async () => {
      const token = 'test-token';

      jest.spyOn(redisRepository, 'get')
        .mockImplementationOnce(() => Promise.resolve(null));

      expect(await redisService.getUser(token)).not.toBeDefined();
    });
  });

  describe('saveUser', () => {
    it('should call redis repo save method', async () => {
      const token = 'test-token';

      jest.spyOn(redisRepository, 'set')
        .mockImplementationOnce(() => Promise.resolve(null));

      await redisService.saveUser(token, dbUser);
      expect(redisRepository.set).toHaveBeenCalledWith(token, JSON.stringify(dbUser));
    });

    it('should call redis repo save method with expire time', async () => {
      const token = 'test-token';

      jest.spyOn(redisRepository, 'set')
        .mockImplementationOnce(() => Promise.resolve(null));

      await redisService.saveUser(token, dbUser, 1000);
      expect(redisRepository.set).toHaveBeenCalledWith(token, JSON.stringify(dbUser), 'EX', 1000);
    });
  });
});
