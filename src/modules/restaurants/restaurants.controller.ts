import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurante } from '../../interfaces/restaurants';
import { RestaurantDto } from './dtos/restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  async createRestaurant(@Body(ValidationPipe) createRestaurantDto: RestaurantDto): Promise<Restaurante> {
    return this.restaurantsService.createRestaurant(createRestaurantDto);
  }
  
  @Get()
  async getAllRestaurants(): Promise<Restaurante[]> {
    return this.restaurantsService.getAllRestaurants();
  }
  
  @Get('user/:userId')
  async getRestaurantsByUserId(@Param('userId') userId: string): Promise<Restaurante[]> {
    return this.restaurantsService.getRestaurantsByUserId(userId);
  }
  
  @Get(':id')
  async getRestaurantById(@Param('id') id: string): Promise<Restaurante> {
    return this.restaurantsService.getRestaurantById(id);
  }
  
  @Put(':id')
  async updateRestaurant(@Param('id') id: string, @Body() restaurantData: Partial<Restaurante>): Promise<Restaurante> {
    return this.restaurantsService.updateRestaurant(id, restaurantData);
  }
  
  @Delete(':id')
  async deleteRestaurant(@Param('id') id: string): Promise<void> {
    return this.restaurantsService.deleteRestaurant(id);
  }
} 