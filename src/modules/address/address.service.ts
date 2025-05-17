import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { AddressDto } from './dtos/address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createAddress(addressData: AddressDto): Promise<AddressDto> {
    try {
      const addressId = this.firebaseService.db.collection('addresses').doc().id;
      
      const newAddress: AddressDto = {
        ...addressData,
      };
      
      await this.firebaseService.db.collection('addresses').doc(addressId).set(newAddress);
      
      return newAddress;
    } catch (error) {
      console.error('Erro ao criar endereço:', error);
      throw new Error(`Falha ao criar endereço: ${error.message}`);
    }
  }
  
  async getAddressById(id: string): Promise<AddressDto> {
    const addressDoc = await this.firebaseService.db.collection('addresses').doc(id).get();
    if (!addressDoc.exists) {
      throw new Error('Endereço não encontrado');
    }
    return addressDoc.data() as AddressDto;
  }
  
  async getAllAddresses(): Promise<AddressDto[]> {
    const addressesSnapshot = await this.firebaseService.db.collection('addresses').get();
    return addressesSnapshot.docs.map(doc => doc.data() as AddressDto);
  }
  
  async getAddressesByUser(userId: string): Promise<AddressDto[]> {
    const addressesSnapshot = await this.firebaseService.db
      .collection('addresses')
      .where('userId', '==', userId)
      .get();
    
    return addressesSnapshot.docs.map(doc => doc.data() as AddressDto);
  }
  
  async updateAddress(id: string, addressData: Partial<AddressDto>): Promise<AddressDto> {
    await this.firebaseService.db.collection('addresses').doc(id).update(addressData);
    return this.getAddressById(id);
  }
  
  async deleteAddress(id: string): Promise<void> {
    await this.firebaseService.db.collection('addresses').doc(id).delete();
  }
}
