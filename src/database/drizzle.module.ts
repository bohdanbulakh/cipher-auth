import { DrizzleAsyncProvider, drizzleProvider } from './drizzle';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [...drizzleProvider],
  exports: [DrizzleAsyncProvider],
})
export class DrizzleModule {}
