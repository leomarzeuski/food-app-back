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

  async addAddress(userId: string, addressData: CreateAddressDto): Promise<Omit<User, 'senha'>> {
    const userDoc = await this.firebaseService.db.collection('usuarios').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    const user = userDoc.data() as User;
    
    const addressId = this.firebaseService.db.collection('temp').doc().id;
    
    const newAddress: Address = {
      id: addressId,
      ...addressData
    };
    
    const enderecos = user.enderecos || [];
    enderecos.push(newAddress);
    
    await this.firebaseService.db.collection('usuarios').doc(userId).update({
      enderecos: enderecos
    });
    
    return this.getUserById(userId);
  }

  async getUserAddresses(userId: string): Promise<Address[]> {
    const userDoc = await this.firebaseService.db.collection('usuarios').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    const user = userDoc.data() as User;
    return user.enderecos || [];
  }

  async updateAddress(
    userId: string, 
    addressId: string, 
    addressData: Partial<CreateAddressDto>
  ): Promise<Omit<User, 'senha'>> {
    const userDoc = await this.firebaseService.db.collection('usuarios').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    const user = userDoc.data() as User;
    const enderecos = user.enderecos || [];
    
    const addressIndex = enderecos.findIndex(addr => addr.id === addressId);
    
    if (addressIndex === -1) {
      throw new NotFoundException('Endereço não encontrado');
    }
    
    enderecos[addressIndex] = {
      ...enderecos[addressIndex],
      ...addressData
    };
    
    await this.firebaseService.db.collection('usuarios').doc(userId).update({
      enderecos: enderecos
    });
    
    return this.getUserById(userId);
  }

  async deleteAddress(userId: string, addressId: string): Promise<Omit<User, 'senha'>> {
    const userDoc = await this.firebaseService.db.collection('usuarios').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    const user = userDoc.data() as User;
    const enderecos = user.enderecos || [];
    
    const updatedAddresses = enderecos.filter(addr => addr.id !== addressId);
    
    if (updatedAddresses.length === enderecos.length) {
      throw new NotFoundException('Endereço não encontrado');
    }
    
    await this.firebaseService.db.collection('usuarios').doc(userId).update({
      enderecos: updatedAddresses
    });
    
    return this.getUserById(userId);
  }
}