import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersSelect } from '../../database/entities/user.entity';

export const GetUser = createParamDecorator(
  (field: keyof Omit<UsersSelect, 'password'> | null = null, ctx: ExecutionContext) => {
    const request: Request & { user: UsersSelect } = ctx.switchToHttp().getRequest();
    return field ? request.user?.[field] : request.user;
  });
