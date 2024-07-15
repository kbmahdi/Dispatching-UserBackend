import { Controller, Post, Body, Get, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { DeleteUsersDto } from './dto/delete-users.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successful login' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() body: RegisterDto) {
    const { username, password, email, role } = body;
    return this.authService.register(username, password, email, role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post('change-role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user role' })
  @ApiResponse({ status: 200, description: 'User role changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: ChangeRoleDto })
  async changeRole(@Body() body: ChangeRoleDto) {
    const { username, newRole } = body;
    const user = await this.userService.updateRole(username, newRole);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Delete('delete-user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: DeleteUserDto })
  async deleteUser(@Body() body: DeleteUserDto) {
    const { username } = body;
    const user = await this.userService.deleteUser(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Delete('delete-users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete multiple users' })
  @ApiResponse({ status: 200, description: 'Users deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: DeleteUsersDto })
  async deleteUsers(@Body() body: DeleteUsersDto) {
    const { usernames } = body;
    const deletedUsers = [];

    for (const username of usernames) {
      const user = await this.userService.deleteUser(username);
      if (user) {
        deletedUsers.push(username);
      }
    }

    if (deletedUsers.length === 0) {
      throw new UnauthorizedException('No users found');
    }

    return { message: 'Users deleted successfully', deletedUsers };
  }


  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Body() body: ChangePasswordDto, @Body('username') username: string) {
    const { newPassword } = body;
    const user = await this.userService.changePassword(username, newPassword);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { message: 'Password changed successfully' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Get('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllUsers() {
    return this.userService.findAll();
  }
}
