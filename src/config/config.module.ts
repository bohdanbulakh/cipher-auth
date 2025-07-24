import { Module } from '@nestjs/common';
import { ConfigModule as ConfigurationModule, ConfigService } from '@nestjs/config';
import { SecurityConfigService } from './security-config.service';

@Module({
  providers: [ConfigService, SecurityConfigService],
  exports: [SecurityConfigService],
})
export class ConfigModule extends ConfigurationModule {}
