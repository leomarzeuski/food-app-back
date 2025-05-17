import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItemDto } from './dtos/menu-item.dto';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  async createMenuItem(@Body(ValidationPipe) createMenuItemDto: MenuItemDto): Promise<MenuItemDto> {
    return this.menuItemsService.createMenuItem(createMenuItemDto);
  }
  
  @Get()
  async getAllMenuItems(): Promise<MenuItemDto[]> {
    return this.menuItemsService.getAllMenuItems();
  }
  
  @Get(':id')
  async getMenuItemById(@Param('id') id: string): Promise<MenuItemDto> {
    return this.menuItemsService.getMenuItemById(id);
  }
  
  @Get('restaurant/:restauranteId')
  async getMenuItemsByRestaurant(@Param('restauranteId') restauranteId: string): Promise<MenuItemDto[]> {
    return this.menuItemsService.getMenuItemsByRestaurant(restauranteId);
  }
  
  @Put(':id')
  async updateMenuItem(@Param('id') id: string, @Body() menuItemData: Partial<MenuItemDto>): Promise<MenuItemDto> {
    return this.menuItemsService.updateMenuItem(id, menuItemData);
  }
  
  @Put(':id/availability')
  async updateMenuItemAvailability(@Param('id') id: string, @Body('disponivel') disponivel: boolean): Promise<MenuItemDto> {
    return this.menuItemsService.updateMenuItemAvailability(id, disponivel);
  }
  
  @Delete(':id')
  async deleteMenuItem(@Param('id') id: string): Promise<void> {
    return this.menuItemsService.deleteMenuItem(id);
  }
} 