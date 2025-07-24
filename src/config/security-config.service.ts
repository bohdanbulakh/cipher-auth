import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityConfigService {
  constructor (private configService: ConfigService) {}

  get databaseUrl () : string {
    const url = this.configService.get<string>('databaseUrl');
    return checkForExistance(url, 'database url');
  }

  get accessSecret (): string {
    const secret =  this.configService.get<string>('security.access.secret');
    return checkForExistance(secret, 'access secret');
  }

  get accessTtl (): string {
    const ttl = this.configService.get<string>('security.access.ttl');
    return checkForExistance(ttl, 'access ttl');
  }

  get refreshSecret (): string {
    const secret =  this.configService.get<string>('security.refresh.secret');
    return checkForExistance(secret, 'refresh secret');
  }

  get refreshTtl (): string {
    const ttl = this.configService.get<string>('security.refresh.ttl');
    return checkForExistance(ttl, 'refresh ttl');
  }
}

function checkForExistance<T> (variable: T, name: string): NonNullable<T> {
  if (!variable) throw new Error(`No ${name} specified`);
  return variable;
}
