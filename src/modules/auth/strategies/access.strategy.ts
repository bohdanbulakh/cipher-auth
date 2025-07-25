import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CookieUtils } from '../../../common/utils/request.utils';
import { SecurityConfigService } from '../../../config/security-config.service';
import { DrizzleAsyncProvider } from '../../../database/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../../../database/schema';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt.payload';
import { UsersInsert } from '../../../database/entities/user.entity';
import { InvalidEntityIdException } from '../../../common/exceptions/invalid-entity-id-exception';
import { RedisService } from '../../../redis/redis.service';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy) {
  constructor (
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly redisService: RedisService,
    private readonly authService: AuthService,
    configService: SecurityConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([CookieUtils.getRequestJwt]),
      secretOrKey: configService.accessSecret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate (request: Request, payload: JwtPayload): Promise<Omit<UsersInsert, 'password'>> {
    const token = CookieUtils.getRequestJwt(request);
    const jwtExpires = this.authService.getTokenExpTime(token, 's');

    if (!payload) throw new UnauthorizedException();

    const user = await this.db.query.users.findFirst({
      where: (user, { eq }) =>
        eq(user.id, payload.sub),
    });

    if (!user) throw new InvalidEntityIdException('User');

    const { password: _, ...result } = user;
    await this.redisService.saveUser(token, result, jwtExpires);
    return result;
  }
}
