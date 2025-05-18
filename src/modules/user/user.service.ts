import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreateAddressDto, UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { Address, User } from 'src/interfaces/user';

@Injectable()
export class UserService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async registerUser(userData: UserDto): Promise<Omit<User, 'senha'>> {
    try {
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }
      
      const userId = this.firebaseService.db.collection('usuarios').doc().id;
      
      const hashedPassword = await bcrypt.hash(userData.senha, 10);
      
      const newUser = {
        id: userId,
        ...userData,
        senha: hashedPassword, 
        createdAt: new Date().toISOString(),
      };
      
      await this.firebaseService.db.collection('usuarios').doc(userId).set(newUser);
      
      const { senha, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const usersSnapshot = await this.firebaseService.db
      .collection('usuarios')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (usersSnapshot.empty) {
      return null;
    }
    
    return usersSnapshot.docs[0].data() as User;
  }
  
  async getUserById(id: string): Promise<Omit<User, 'senha'>> {
    const userDoc = await this.firebaseService.db.collection('usuarios').doc(id).get();
    if (!userDoc.exists) {
      throw new Error('Usuário não encontrado');
    }
    
    const user = userDoc.data() as User;
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  async getAllUsers(): Promise<Omit<User, 'senha'>[]> {
    const usersSnapshot = await this.firebaseService.db.collection('usuarios').get();
    return usersSnapshot.docs.map(doc => {
      const user = doc.data() as User;
      const { senha, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
  
  async updateUser(id: string, userData: Partial<User>): Promise<Omit<User, 'senha'>> {
    if (userData.senha) {
      userData.senha = await bcrypt.hash(userData.senha, 10);
    }
    
    await this.firebaseService.db.collection('usuarios').doc(id).update(userData);
    return this.getUserById(id);
  }
  
  async deleteUser(id: string): Promise<void> {
    await this.firebaseService.db.collection('usuarios').doc(id).delete();
  }

  
}