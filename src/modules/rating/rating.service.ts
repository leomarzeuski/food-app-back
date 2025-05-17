import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { Rating } from '../../interfaces/rating';
import {RatingDto } from './dtos/rating.dto';

@Injectable()
export class RatingService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createRating(ratingData: RatingDto): Promise<Rating> {
    try {
      const ratingId = this.firebaseService.db.collection('ratings').doc().id;
      
      const newRating = {
        id: ratingId,
        ...ratingData,
        createdAt: new Date().toISOString(),
      };
      
      await this.firebaseService.db.collection('ratings').doc(ratingId).set(newRating);
      
      return newRating;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw new Error(`Falha ao criar avaliação: ${error.message}`);
    }
  }
  
  async getRatingById(id: string): Promise<Rating> {
    const ratingDoc = await this.firebaseService.db.collection('ratings').doc(id).get();
    if (!ratingDoc.exists) {
      throw new Error('Avaliação não encontrada');
    }
    return ratingDoc.data() as Rating;
  }
  
  async getAllRatings(): Promise<Rating[]> {
    const ratingsSnapshot = await this.firebaseService.db.collection('ratings').get();
    return ratingsSnapshot.docs.map(doc => doc.data() as Rating);
  }
  
  async getRatingsByUser(userId: string): Promise<Rating[]> {
    const ratingsSnapshot = await this.firebaseService.db
      .collection('ratings')
      .where('userId', '==', userId)
      .get();
    
    return ratingsSnapshot.docs.map(doc => doc.data() as Rating);
  }
  
  async getRatingByOrder(orderId: string): Promise<Rating> {
    const ratingsSnapshot = await this.firebaseService.db
      .collection('ratings')
      .where('orderId', '==', orderId)
      .limit(1)
      .get();
    
    if (ratingsSnapshot.empty) {
      throw new Error('Avaliação não encontrada para este pedido');
    }
    
    return ratingsSnapshot.docs[0].data() as Rating;
  }
  
  async updateRating(id: string, ratingData: Partial<Rating>): Promise<Rating> {
    await this.firebaseService.db.collection('ratings').doc(id).update(ratingData);
    return this.getRatingById(id);
  }
  
  async deleteRating(id: string): Promise<void> {
    await this.firebaseService.db.collection('ratings').doc(id).delete();
  }
}
