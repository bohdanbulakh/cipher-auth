import { NotFoundException } from '@nestjs/common';

export class InvalidEntityIdException extends NotFoundException {
  constructor (entity: string) {
    entity = entity.at(0)?.toUpperCase() + entity.slice(1);
    super(`${entity} with such id not found`);
  }
}
