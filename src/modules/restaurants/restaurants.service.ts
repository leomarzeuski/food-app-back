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
  const restaurants = restaurantsSnapshot.docs.map(doc => {
    return {
      id: doc.id,
      ...doc.data()
    } as Restaurante;
  });
  
  const ratingsSnapshot = await this.firebaseService.db.collection('ratings').get();
  const ratings = ratingsSnapshot.docs.map(doc => doc.data());
  
  return restaurants.map(restaurant => {
    const restaurantRatings = ratings.filter(rating => rating.restaurantId === restaurant.id);
    
    let ratingAverage = 0;
    if (restaurantRatings.length > 0) {
      const sum = restaurantRatings.reduce((total, rating) => total + rating.nota, 0);
      ratingAverage = Number((sum / restaurantRatings.length).toFixed(2));
    }
    
    return {
      ...restaurant,
      ratingAverage
    };
  });
}
  
  async updateRestaurant(id: string, restaurantData: Partial<Restaurante>): Promise<Restaurante> {
    await this.firebaseService.db.collection('restaurantes').doc(id).update(restaurantData);
    return this.getRestaurantById(id);
  }
  
  async deleteRestaurant(id: string): Promise<void> {
    await this.firebaseService.db.collection('restaurantes').doc(id).delete();
  }
}
