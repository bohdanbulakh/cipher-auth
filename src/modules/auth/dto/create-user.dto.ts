import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username must be a string' })
    username: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString({ message: 'Password must be a string' })
    password: string;

  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsString({ message: 'First name must be a string' })
    firstName: string;

  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
    lastName?: string;
}
