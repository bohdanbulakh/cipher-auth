import { Module } from '@nestjs/common';
import { ApiModule } from './modules/api.module';
import { DrizzleModule } from './database/drizzle.module';
import { ConfigModule } from './config/config.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ApiModule,
    DrizzleModule,
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
