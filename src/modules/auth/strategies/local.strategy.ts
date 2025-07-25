import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DrizzleAsyncProvider } from '../../../database/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../../../database/schema';
import { UsersSelect } from '../../../database/entities/user.entity';
import { InvalidEntityIdException } from '../../../common/exceptions/invalid-entity-id-exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor (
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {
    super();
  }

  async validate (username: string, password: string) {
    const user: UsersSelect | undefined = await this.db.query.users.findFirst({
      where: (users, { eq }) =>
        eq(users.username, username),
    });

    if (!user) throw new InvalidEntityIdException('user');

    await this.validatePassword(password, user.password);
    const { password: _, ...result } = user;
    return result;
  }

  private async validatePassword (password: string, hash: string) {
    const matches = await bcrypt.compare(password, hash);
    if (!matches) throw new UnauthorizedException('The password is incorrect');
  }
}
