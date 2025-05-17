import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '../../interfaces/order';
import { CreateOrderDto } from './dtos/item-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body(ValidationPipe) createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }
  
  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }
  
  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }
  
  @Get('user/:userId')
  async getOrdersByUser(@Param('userId') userId: string): Promise<Order[]> {
    return this.orderService.getOrdersByUser(userId);
  }
  
  @Get('restaurant/:restaurantId')
  async getOrdersByRestaurant(@Param('restaurantId') restaurantId: string): Promise<Order[]> {
    return this.orderService.getOrdersByRestaurant(restaurantId);
  }
  
  @Put(':id')
  async updateOrder(@Param('id') id: string, @Body() orderData: Partial<Order>): Promise<Order> {
    return this.orderService.updateOrder(id, orderData);
  }
  
  @Put(':id/status')
  async updateOrderStatus(
    @Param('id') id: string, 
    @Body('status') status: 'novo' | 'preparando' | 'pronto' | 'entregando' | 'entregue' | 'cancelado'
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(id, status);
  }
  
  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<void> {
    return this.orderService.deleteOrder(id);
  }
} 