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

  get redisPassword (): string {
    const password = this.configService.get<string>('redis.password');
    return checkForExistance(password, 'redis password');
  }

  get redisHost (): string {
    const host = this.configService.get<string>('redis.host');
    return checkForExistance(host, 'redis host');
  }

  get redisPort (): number {
    const port = this.configService.get<string>('redis.port');
    return +checkForExistance(port, 'redis port');
  }
}

function checkForExistance<T> (variable: T, name: string): NonNullable<T> {
  if (!variable) throw new Error(`No ${name} specified`);
  return variable;
}
