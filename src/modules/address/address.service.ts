// src/modules/address/address.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { AddressDto } from './dtos/address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createAddress(addressData: AddressDto): Promise<AddressDto> {
    try {
      const addressId = this.firebaseService.db.collection('addresses').doc().id;
      
      const newAddress: AddressDto = {
        id: addressId,
        ...addressData,
        createdAt: new Date().toISOString(),
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
      throw new NotFoundException('Endereço não encontrado');
    }
    return {
      id: addressDoc.id,
      ...addressDoc.data()
    } as AddressDto;
  }
  
  async getAllAddresses(): Promise<AddressDto[]> {
    const addressesSnapshot = await this.firebaseService.db.collection('addresses').get();
    return addressesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as AddressDto);
  }
  
  async getAddressesByEntityId(entityId: string, entityType: 'user' | 'restaurant'): Promise<AddressDto[]> {
    const addressesSnapshot = await this.firebaseService.db
      .collection('addresses')
      .where('entityId', '==', entityId)
      .where('entityType', '==', entityType)
      .get();
    
    return addressesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as AddressDto);
  }
  
  async updateAddress(id: string, addressData: Partial<AddressDto>): Promise<AddressDto> {
    const addressDoc = await this.firebaseService.db.collection('addresses').doc(id).get();
    
    if (!addressDoc.exists) {
      throw new NotFoundException('Endereço não encontrado');
    }
    
    await this.firebaseService.db.collection('addresses').doc(id).update({
      ...addressData,
      updatedAt: new Date().toISOString(),
    });
    
    return this.getAddressById(id);
  }
  
  async deleteAddress(id: string): Promise<void> {
    const addressDoc = await this.firebaseService.db.collection('addresses').doc(id).get();
    
    if (!addressDoc.exists) {
      throw new NotFoundException('Endereço não encontrado');
    }
    
    await this.firebaseService.db.collection('addresses').doc(id).delete();
  }
  
  async setAddressAsPrimary(id: string, entityId: string, entityType: 'user' | 'restaurant'): Promise<void> {
    const addressesSnapshot = await this.firebaseService.db
      .collection('addresses')
      .where('entityId', '==', entityId)
      .where('entityType', '==', entityType)
      .get();
      
    const batch = this.firebaseService.db.batch();
    addressesSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { principal: false });
    });
    
    const addressDoc = this.firebaseService.db.collection('addresses').doc(id);
    batch.update(addressDoc, { principal: true });
    
    await batch.commit();
  }
}