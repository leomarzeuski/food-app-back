import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { Restaurante } from '../../interfaces/restaurants';

@Injectable()
export class RestaurantsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createRestaurant(restaurantData: Omit<Restaurante, 'id' | 'createdAt'>): Promise<Restaurante> {
    try {
      const restaurantId = this.firebaseService.db.collection('restaurantes').doc().id;
      
      const newRestaurant = {
        id: restaurantId,
        ...restaurantData,
        createdAt: new Date().toISOString(),
      };
      
      await this.firebaseService.db.collection('restaurantes').doc(restaurantId).set(newRestaurant);
      
      return newRestaurant;
    } catch (error) {
      console.error('Erro ao criar restaurante:', error);
      throw new Error(`Falha ao criar restaurante: ${error.message}`);
    }
  }
  
  async getRestaurantById(id: string): Promise<Restaurante> {
    console.log({id});
    const restaurantDoc = await this.firebaseService.db.collection('restaurantes').doc(id).get();
    if (!restaurantDoc.exists) {
      throw new Error('Restaurante não encontrado');
    }
    return restaurantDoc.data() as Restaurante;
  }
  
  async getRestaurantsByUserId(userId: string): Promise<Restaurante[]> {
    const restaurantsSnapshot = await this.firebaseService.db
      .collection('restaurantes')
      .where('userId', '==', userId)
      .get();
    
    return restaurantsSnapshot.docs.map(doc => doc.data() as Restaurante);
  }
  
  async getAllRestaurants(): Promise<Restaurante[]> {
    const restaurantsSnapshot = await this.firebaseService.db.collection('restaurantes').get();
    return restaurantsSnapshot.docs.map(doc => doc.data() as Restaurante);
  }
  
  async updateRestaurant(id: string, restaurantData: Partial<Restaurante>): Promise<Restaurante> {
    await this.firebaseService.db.collection('restaurantes').doc(id).update(restaurantData);
    return this.getRestaurantById(id);
  }
  
  async deleteRestaurant(id: string): Promise<void> {
    await this.firebaseService.db.collection('restaurantes').doc(id).delete();
  }
}
