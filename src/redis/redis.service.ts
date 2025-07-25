import { RedisRepository } from './redis.repository';
import { UserResponse } from '../modules/auth/responses/user.response';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor (private readonly redisRepository: RedisRepository) {}

  async getUser (token: string) {
    const user = await this.redisRepository.get(token);
    if (!user) return;

    return JSON.parse(user) as UserResponse;
  }

  async saveUser (token: string, user: UserResponse, expires?: number) {
    const data = JSON.stringify(user);
    if (expires) {
      await this.redisRepository.set(token, data, 'EX', expires);
    } else {
      await this.redisRepository.set(token, data);
    }
  }
}
