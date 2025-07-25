import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { CookieUtils } from '../utils/request.utils';
import { Request } from 'express';

@Injectable()
export class AccessGuard extends AuthGuard('jwt') {
  constructor (private readonly redisService: RedisService) {
    super();
  }

  async canActivate (context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const token = CookieUtils.getRequestJwt(request);

    if (!token) {
      return false;
    }

    const cachedUser = await this.redisService.getUser(token);

    if (cachedUser) {
      request.user = cachedUser;
      return true;
    }
    return super.canActivate(context) as Promise<boolean>;
  }
}
