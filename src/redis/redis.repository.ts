import {
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';
import Redis from 'ioredis';
import { SecurityConfigService } from '../config/security-config.service';

@Injectable()
export class RedisRepository extends Redis implements OnModuleDestroy {
  constructor (serviceConfig: SecurityConfigService) {
    super({
      password: serviceConfig.redisPassword,
      host: serviceConfig.redisHost,
      port: serviceConfig.redisPort,
    });
  }

  onModuleDestroy () {
    this.disconnect(false);
  }
}
