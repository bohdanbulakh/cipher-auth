
import { Global, Module } from '@nestjs/common';

import { RedisRepository } from './redis.repository';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisRepository, RedisService],
  exports: [RedisRepository, RedisService],
})
export class RedisModule {}
