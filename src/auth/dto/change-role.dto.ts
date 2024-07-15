import { ApiProperty } from '@nestjs/swagger';

export class ChangeRoleDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  newRole: string;
}
