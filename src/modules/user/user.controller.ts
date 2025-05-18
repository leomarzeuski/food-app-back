import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateAddressDto, UserDto } from './dtos/user.dto';
import { User } from 'src/interfaces/user';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerUser: UserDto): Promise<Omit<User, 'senha'>> {
    return this.userService.registerUser(registerUser);
  }
  
  @Get()
  async getAllUsers(): Promise<Omit<User, 'senha'>[]> {
    return this.userService.getAllUsers();
  }
  
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Omit<User, 'senha'>> {
    return this.userService.getUserById(id);
  }
  
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: Partial<User>): Promise<Omit<User, 'senha'>> {
    return this.userService.updateUser(id, userData);
  }
  
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Post(':id/addresses')
  async addAddress(
    @Param('id') userId: string, 
    @Body(ValidationPipe) addressData: CreateAddressDto
  ): Promise<Omit<User, 'senha'>> {
    return this.userService.addAddress(userId, addressData);
  }

  @Get(':id/addresses')
  async getUserAddresses(@Param('id') userId: string) {
    return this.userService.getUserAddresses(userId);
  }

  @Put(':userId/addresses/:addressId')
  async updateAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
    @Body(ValidationPipe) addressData: Partial<CreateAddressDto>
  ) {
    return this.userService.updateAddress(userId, addressId, addressData);
  }

  @Delete(':userId/addresses/:addressId')
  async deleteAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string
  ) {
    return this.userService.deleteAddress(userId, addressId);
  }
}