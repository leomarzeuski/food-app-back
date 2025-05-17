import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { RatingService } from './rating.service';
import { Rating } from '../../interfaces/rating';
import { RatingDto } from './dtos/rating.dto';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async createRating(@Body(ValidationPipe) createRatingDto: RatingDto): Promise<Rating> {
    return this.ratingService.createRating(createRatingDto);
  }
  
  @Get()
  async getAllRatings(): Promise<Rating[]> {
    return this.ratingService.getAllRatings();
  }
  
  @Get(':id')
  async getRatingById(@Param('id') id: string): Promise<Rating> {
    return this.ratingService.getRatingById(id);
  }
  
  @Get('user/:userId')
  async getRatingsByUser(@Param('userId') userId: string): Promise<Rating[]> {
    return this.ratingService.getRatingsByUser(userId);
  }
  
  @Get('order/:orderId')
  async getRatingByOrder(@Param('orderId') orderId: string): Promise<Rating> {
    return this.ratingService.getRatingByOrder(orderId);
  }
  
  @Put(':id')
  async updateRating(@Param('id') id: string, @Body() ratingData: Partial<Rating>): Promise<Rating> {
    return this.ratingService.updateRating(id, ratingData);
  }
  
  @Delete(':id')
  async deleteRating(@Param('id') id: string): Promise<void> {
    return this.ratingService.deleteRating(id);
  }
} 