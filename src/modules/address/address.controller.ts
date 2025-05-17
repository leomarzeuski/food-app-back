import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto } from './dtos/address.dto';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(@Body(ValidationPipe) createAddressDto: AddressDto): Promise<AddressDto> {
    return this.addressService.createAddress(createAddressDto);
  }
  
  @Get()
  async getAllAddresses(): Promise<AddressDto[]> {
    return this.addressService.getAllAddresses();
  }
  
  @Get(':id')
  async getAddressById(@Param('id') id: string): Promise<AddressDto> {
    return this.addressService.getAddressById(id);
  }
  
  @Get('user/:userId')
  async getAddressesByUser(@Param('userId') userId: string): Promise<AddressDto[]> {
    return this.addressService.getAddressesByUser(userId);
  }
  
  @Put(':id')
  async updateAddress(@Param('id') id: string, @Body() addressData: Partial<AddressDto>): Promise<AddressDto> {
    return this.addressService.updateAddress(id, addressData);
  }
  
  @Delete(':id')
  async deleteAddress(@Param('id') id: string): Promise<void> {
    return this.addressService.deleteAddress(id);
  }
} 