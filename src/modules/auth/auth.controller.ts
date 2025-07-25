import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalGuard } from '../../common/guards/local.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UsersSelect } from '../../database/entities/user.entity';
import { CookieUtils } from '../../common/utils/request.utils';
import { Response } from 'express';
import { AccessGuard } from '../../common/guards/access.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResponse } from './responses/user.response';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('register')
  @ApiBadRequestResponse({
    description: `
    InvalidBodyException:
      First name cannot be empty
      First name must be string
      Last name must be string
      Username must be a string
      Username cannot be empty
      Password cannot be empty
      Password must be string
      
    AlreadyRegisteredException:
      User with such username is already registered`,
  })
  @ApiCreatedResponse({
    type: UserResponse,
  })
  register (@Body() body: CreateUserDto) {
    return this.authService.createUser(body);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiBadRequestResponse({
    description: `
    InvalidBodyException:
      Username must be a string
      Username cannot be empty
      Password cannot be empty
      Password must be string`,
  })
  @ApiUnauthorizedResponse({
    description: `
    UnauthorizedException:
      The password is incorrect`,
  })
  @ApiNotFoundResponse({
    description: `
    InvalidEntityIdException:
      User with such id not found`,
  })
  @ApiCreatedResponse()
  @ApiBody({ type: LoginDto })
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
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({
    description: `
    UnauthorizedException:
      Unauthorized`,
  })
  @ApiNotFoundResponse({
    description: `
    InvalidEntityIdException:
      User with such id not found`,
  })
  @ApiOkResponse({
    type: UserResponse,
  })
  getMe (@GetUser() user: UsersSelect) {
    return user;
  }
}
