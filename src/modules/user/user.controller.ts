import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';
import { User } from '../../interfaces/user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerUser: UserDto): Promise<User> {
    return this.userService.registerUser(registerUser);
  }
  
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
  
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }
  
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: Partial<User>): Promise<User> {
    return this.userService.updateUser(id, userData);
  }
  
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}