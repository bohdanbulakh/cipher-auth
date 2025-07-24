import { Module } from '@nestjs/common';
import { ApiModule } from './modules/api.module';
import { DrizzleModule } from './database/drizzle.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ApiModule,
    DrizzleModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
