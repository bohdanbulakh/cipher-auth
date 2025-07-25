import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    LocalStrategy,
  ],
})
export class AuthModule {}
