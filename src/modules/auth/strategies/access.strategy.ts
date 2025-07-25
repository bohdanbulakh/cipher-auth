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

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy) {
  constructor (
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
    configService: SecurityConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([CookieUtils.getRequestJwt]),
      secretOrKey: configService.accessSecret,
      ignoreExpiration: false,
    });
  }

  async validate (payload: JwtPayload): Promise<Omit<UsersInsert, 'password'>> {
    if (!payload) throw new UnauthorizedException();

    const user = await this.db.query.users.findFirst({
      where: (user, { eq }) =>
        eq(user.id, payload.sub),
    });

    if (!user) throw new InvalidEntityIdException('User');

    const { password: _, ...result } = user;
    return result;
  }
}
