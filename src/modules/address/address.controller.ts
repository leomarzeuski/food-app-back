// src/modules/address/address.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto } from './dtos/address.dto';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(@Body(ValidationPipe) addressData: AddressDto): Promise<AddressDto> {
    return this.addressService.createAddress(addressData);
  }
  
  @Get()
  async getAddresses(
    @Query('entityId') entityId?: string,
    @Query('entityType') entityType?: 'user' | 'restaurant',
  ): Promise<AddressDto[]> {
    if (entityId && entityType) {
      return this.addressService.getAddressesByEntityId(entityId, entityType);
    }
    return this.addressService.getAllAddresses();
  }
  
  @Get(':id')
  async getAddressById(@Param('id') id: string): Promise<AddressDto> {
    return this.addressService.getAddressById(id);
  }
  
  @Put(':id')
  async updateAddress(
    @Param('id') id: string,
    @Body() addressData: Partial<AddressDto>,
  ): Promise<AddressDto> {
    return this.addressService.updateAddress(id, addressData);
  }
  
  @Delete(':id')
  async deleteAddress(@Param('id') id: string): Promise<void> {
    return this.addressService.deleteAddress(id);
  }
  
  @Put(':id/primary')
  async setAddressAsPrimary(
    @Param('id') id: string,
    @Body('entityId') entityId: string,
    @Body('entityType') entityType: 'user' | 'restaurant',
  ): Promise<void> {
    return this.addressService.setAddressAsPrimary(id, entityId, entityType);
  }
}