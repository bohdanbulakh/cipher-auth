import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecurityConfigService {
  private readonly defaultPort = '3000';
  constructor (private configService: ConfigService) {}

  get port (): number {
    let port = this.configService.get<string>('port');
    if (!port) {
      console.warn(`No port specified, the default ${this.defaultPort} will be used`);
      port = this.defaultPort;
    }

    return +port;
  }

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
}

function checkForExistance<T> (variable: T, name: string): NonNullable<T> {
  if (!variable) throw new Error(`No ${name} specified`);
  return variable;
}
