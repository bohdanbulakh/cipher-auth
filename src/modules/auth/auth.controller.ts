import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalGuard } from '../../common/guards/local.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UsersSelect } from '../../database/entities/user.entity';
import { CookieUtils } from '../../common/utils/request.utils';
import { Response } from 'express';
import { AccessGuard } from '../../common/guards/access.guard';
import { use } from 'passport';

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('register')
  register (
    @Body() body: CreateUserDto,
  ) {
    return this.authService.createUser(body);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  login (
    @GetUser() user: UsersSelect,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = this.authService.generateToken(user);
    CookieUtils.setResponseCookie(response, accessToken, {
      accessExpires: this.authService.getTokenExpTime(accessToken),
    });
  }

  @Get('me')
  @UseGuards(AccessGuard)
  getMe (
    @GetUser() user: UsersSelect,
  ) {
    return user;
  }
}
