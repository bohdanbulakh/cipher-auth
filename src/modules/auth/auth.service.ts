import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DrizzleAsyncProvider } from '../../database/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema, users } from '../../database/schema';
import * as bcrypt from 'bcrypt';
import { UsersInsert } from '../../database/entities/user.entity';
import { AlreadyRegisteredException } from '../../common/exceptions/already-registered.exception';
import { JwtService } from '@nestjs/jwt';
import { SecurityConfigService } from '../../config/security-config.service';
import { JwtPayload } from './types/jwt.payload';
import { RedisService } from '../../redis/redis.service';
import { UserResponse } from './responses/user.response';

@Injectable()
export class AuthService {
  constructor (
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly configService: SecurityConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async createUser (data: CreateUserDto) {
    data.password = await this.hashPassword(data.password);
    if (await this.checkIfUserIsRegistered(data.username)) {
      throw new AlreadyRegisteredException();
    }

    const [{ password: _, ...result }]: UsersInsert[] = await this.db
      .insert(users)
      .values(data)
      .returning();

    return result;
  }

  async login (user: UserResponse) {
    const token = this.generateToken(user);
    const tokenExpires = this.getTokenExpTime(token, 's');
    await this.redisService.saveUser(token, user, tokenExpires);

    return token;
  }

  async hashPassword (password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  async checkIfUserIsRegistered (username: string) {
    const user = this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    });

    return !!(await user);
  }

  generateToken (user: UserResponse) {
    const payload: JwtPayload = { sub: user.id };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.accessTtl,
      secret: this.configService.accessSecret,
    });
  }

  getTokenExpTime (token: string, type: 's' | 'ms' = 'ms') {
    const decoded =  this.jwtService.decode(token);
    return decoded['exp'] as number * (type === 'ms' ? 1000 : 1);
  }
}
