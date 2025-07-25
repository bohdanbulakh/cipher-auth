import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DrizzleAsyncProvider } from '../../database/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema, users } from '../../database/schema';
import * as bcrypt from 'bcrypt';
import { UsersInsert, UsersSelect } from '../../database/entities/user.entity';
import { AlreadyRegisteredException } from '../../common/exceptions/already-registered.exception';
import { JwtService } from '@nestjs/jwt';
import { SecurityConfigService } from '../../config/security-config.service';
import { JwtPayload } from './types/jwt.payload';

@Injectable()
export class AuthService {
  constructor (
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly configService: SecurityConfigService,
    private readonly jwtService: JwtService,
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

  private async hashPassword (password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  private async checkIfUserIsRegistered (username: string) {
    const user = this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    });

    return !!(await user);
  }

  generateToken (user: UsersSelect) {
    const payload: JwtPayload = { sub: user.id };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.accessTtl,
      secret: this.configService.accessSecret,
    });
  }

  getTokenExpTime (token: string) {
    const decoded =  this.jwtService.decode(token);
    return decoded['exp'] as number * 1000;
  }
}
