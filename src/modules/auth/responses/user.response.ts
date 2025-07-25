import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
    id: string;

  @ApiProperty()
    username: string;

  @ApiProperty()
    firstName: string;

  @ApiProperty({ nullable: true })
    lastName: string | null;
}
