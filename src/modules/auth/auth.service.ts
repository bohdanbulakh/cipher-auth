import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DrizzleAsyncProvider } from '../../database/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema, users } from '../../database/schema';
import * as bcrypt from 'bcrypt';
import { UsersInsert } from '../../database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor (
    @Inject(DrizzleAsyncProvider)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createUser (data: CreateUserDto) {
    data.password = await this.hashPassword(data.password);
    if (await this.checkIfUserIsRegistered(data.username)) {
      throw new BadRequestException('User with such username is already registered');
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
}
