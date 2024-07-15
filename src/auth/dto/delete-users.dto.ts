import { ApiProperty } from '@nestjs/swagger';

export class DeleteUsersDto {
  @ApiProperty({ type: [String] })
  usernames: string[];
}
