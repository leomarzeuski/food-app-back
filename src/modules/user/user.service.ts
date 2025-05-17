import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { UserDto } from './dtos/user.dto';
import { User } from '../../interfaces/user';

@Injectable()
export class UserService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async registerUser(userData: UserDto): Promise<User> {
    try {
      const userId = this.firebaseService.db.collection('usuarios').doc().id;
      
      const newUser = {
        id: userId,
        ...userData,
        createdAt: new Date().toISOString(),
      };
      
      await this.firebaseService.db.collection('usuarios').doc(userId).set(newUser);
      
      return newUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error(`Falha ao criar usuário: ${error.message}`);
    }
  }
  
  async getUserById(id: string): Promise<User> {
    const userDoc = await this.firebaseService.db.collection('usuarios').doc(id).get();
    if (!userDoc.exists) {
      throw new Error('Usuário não encontrado');
    }
    return userDoc.data() as User;
  }
  
  async getAllUsers(): Promise<User[]> {
    const usersSnapshot = await this.firebaseService.db.collection('usuarios').get();
    return usersSnapshot.docs.map(doc => doc.data() as User);
  }
  
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    await this.firebaseService.db.collection('usuarios').doc(id).update(userData);
    return this.getUserById(id);
  }
  
  async deleteUser(id: string): Promise<void> {
    await this.firebaseService.db.collection('usuarios').doc(id).delete();
  }
}