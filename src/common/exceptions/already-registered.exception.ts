import { BadRequestException } from '@nestjs/common';

export class AlreadyRegisteredException extends BadRequestException {
  constructor () {
    super('User with such username is already registered');
  }
}
