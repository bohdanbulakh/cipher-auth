import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoginDto } from './login.dto';

export class CreateUserDto extends LoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsString({ message: 'First name must be a string' })
    firstName: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
    lastName?: string;
}
