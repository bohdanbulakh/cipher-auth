import { Global, Module } from '@nestjs/common';
import { ConfigModule as ConfigurationModule } from '@nestjs/config';
import { SecurityConfigService } from './security-config.service';
import config from './configuration.constant';

@Global()
@Module({
  imports: [ConfigurationModule.forRoot({
    isGlobal: true, load: [config],
  })],
  providers: [SecurityConfigService],
  exports: [SecurityConfigService],
})
export class ConfigModule extends ConfigurationModule {}
