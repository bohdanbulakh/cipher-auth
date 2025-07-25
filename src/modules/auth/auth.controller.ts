import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor (private readonly appService: AuthService) {}

  @Post('register')
  register (
    @Body() body: CreateUserDto,
  ) {
    return this.appService.createUser(body);
  }
}
