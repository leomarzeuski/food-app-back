import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { Order } from '../../interfaces/order';
import { CreateOrderDto } from './dtos/item-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    try {
      const orderId = this.firebaseService.db.collection('orders').doc().id;
      
      const newOrder = {
        id: orderId,
        ...orderData,
        createdAt: new Date().toISOString(),
      };
      
      await this.firebaseService.db.collection('orders').doc(orderId).set(newOrder);
      
      return newOrder;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw new Error(`Falha ao criar pedido: ${error.message}`);
    }
  }
  
  async getOrderById(id: string): Promise<Order> {
    const orderDoc = await this.firebaseService.db.collection('orders').doc(id).get();
    if (!orderDoc.exists) {
      throw new Error('Pedido não encontrado');
    }
    return orderDoc.data() as Order;
  }
  
  async getAllOrders(): Promise<Order[]> {
    const ordersSnapshot = await this.firebaseService.db.collection('orders').get();
    return ordersSnapshot.docs.map(doc => doc.data() as Order);
  }
  
  async getOrdersByUser(userId: string): Promise<Order[]> {
    const ordersSnapshot = await this.firebaseService.db
      .collection('orders')
      .where('userId', '==', userId)
      .get();
    
    return ordersSnapshot.docs.map(doc => doc.data() as Order);
  }
  
  async getOrdersByRestaurant(restaurantId: string): Promise<Order[]> {
    const ordersSnapshot = await this.firebaseService.db
      .collection('orders')
      .where('restaurantId', '==', restaurantId)
      .get();
    
    return ordersSnapshot.docs.map(doc => doc.data() as Order);
  }
  
  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    await this.firebaseService.db.collection('orders').doc(id).update(orderData);
    return this.getOrderById(id);
  }
  
  async updateOrderStatus(
    id: string, 
    status: 'novo' | 'preparando' | 'pronto' | 'entregando' | 'entregue' | 'cancelado'
  ): Promise<Order> {
    await this.firebaseService.db.collection('orders').doc(id).update({ status });
    return this.getOrderById(id);
  }
  
  async deleteOrder(id: string): Promise<void> {
    await this.firebaseService.db.collection('orders').doc(id).delete();
  }
}
