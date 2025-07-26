import { Test, TestingModule } from '@nestjs/testing';
import { SecurityConfigService } from '../src/config/security-config.service';
import { ConfigService } from '@nestjs/config';

describe('Config Service', () => {
  let configService: ConfigService;
  let securityConfigService: SecurityConfigService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityConfigService,
        ConfigService,
      ],
    }).compile();

    configService = app.get(ConfigService);
    securityConfigService = app.get(SecurityConfigService);
  });


  describe('port', () => {
    it('should return the port', () => {
      const value = '4455';
      jest.spyOn(configService, 'get').mockImplementation(() => value);
      expect(securityConfigService.port).toEqual(+value);
    });

    it('should return default port if there is no env', () => {
      jest.spyOn(configService, 'get').mockImplementation(jest.fn());
      expect(securityConfigService.port).toEqual(3000);
    });
  });

  describe('databaseUrl', () => {
    it('should return the database url', () => {
      const value = 'test';
      jest.spyOn(configService, 'get').mockImplementation(() => value);
      expect(securityConfigService.databaseUrl).toEqual(value);
    });

    it('should throw error if there is no env', () => {
      jest.spyOn(configService, 'get').mockImplementation(jest.fn());
      expect(() => securityConfigService.databaseUrl).toThrow('No database url specified');
    });
  });

  describe('accessSecret', () => {
    it('should return the access secret', () => {
      const value = 'test';
      jest.spyOn(configService, 'get').mockImplementation(() => value);
      expect(securityConfigService.accessSecret).toEqual(value);
    });

    it('should throw error if there is no env', () => {
      jest.spyOn(configService, 'get').mockImplementation(jest.fn());
      expect(() => securityConfigService.accessSecret).toThrow('No access secret specified');
    });
  });

  describe('accessTtl', () => {
    it('should return the access ttl', () => {
      const value = 'test';
      jest.spyOn(configService, 'get').mockImplementation(() => value);
      expect(securityConfigService.accessTtl).toEqual(value);
    });

    it('should throw error if there is no env', () => {
      jest.spyOn(configService, 'get').mockImplementation(jest.fn());
      expect(() => securityConfigService.accessTtl).toThrow('No access ttl specified');
    });
  });

  describe('redisPassword', () => {
    it('should return the redis password', () => {
      const value = 'test';
      jest.spyOn(configService, 'get').mockImplementation(() => value);
      expect(securityConfigService.redisPassword).toEqual(value);
    });

    it('should throw error if there is no env', () => {
      jest.spyOn(configService, 'get').mockImplementation(jest.fn());
      expect(() => securityConfigService.redisPassword).toThrow('No redis password specified');
    });
  });

  describe('redisHost', () => {
    it('should return the redis host', () => {
      const value = 'test';
      jest.spyOn(configService, 'get').mockImplementation(() => value);
      expect(securityConfigService.redisHost).toEqual(value);
    });

    it('should throw error if there is no env', () => {
      jest.spyOn(configService, 'get').mockImplementation(jest.fn());
      expect(() => securityConfigService.redisHost).toThrow('No redis host specified');
    });
  });

  describe('redisPort', () => {
    it('should return the redis port', () => {
      const value = '1234';
      jest.spyOn(configService, 'get').mockImplementation(() => value);
      expect(securityConfigService.redisPort).toEqual(+value);
    });

    it('should throw error if there is no env', () => {
      jest.spyOn(configService, 'get').mockImplementation(jest.fn());
      expect(() => securityConfigService.redisPort).toThrow('No redis port specified');
    });
  });
});
