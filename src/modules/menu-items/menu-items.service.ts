import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { MenuItemDto } from './dtos/menu-item.dto';

@Injectable()
export class MenuItemsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createMenuItem(menuItemData: MenuItemDto): Promise<MenuItemDto> {
    try {
      const menuItemId = this.firebaseService.db.collection('menu-items').doc().id;
      
      const newMenuItem = {
        id: menuItemId,
        ...menuItemData,
      };
      
      await this.firebaseService.db.collection('menu-items').doc(menuItemId).set(newMenuItem);
      
      return newMenuItem;
    } catch (error) {
      console.error('Erro ao criar item do menu:', error);
      throw new Error(`Falha ao criar item do menu: ${error.message}`);
    }
  }
  
  async getMenuItemById(id: string): Promise<MenuItemDto> {
    const menuItemDoc = await this.firebaseService.db.collection('menu-items').doc(id).get();
    if (!menuItemDoc.exists) {
      throw new Error('Item do menu não encontrado');
    }
    return menuItemDoc.data() as MenuItemDto;
  }
  
  async getAllMenuItems(): Promise<MenuItemDto[]> {
    const menuItemsSnapshot = await this.firebaseService.db.collection('menu-items').get();
    return menuItemsSnapshot.docs.map(doc => doc.data() as MenuItemDto);
  }
  
  async getMenuItemsByRestaurant(restauranteId: string): Promise<MenuItemDto[]> {
    const menuItemsSnapshot = await this.firebaseService.db
      .collection('menu-items')
      .where('restauranteId', '==', restauranteId)
      .get();
    
    return menuItemsSnapshot.docs.map(doc => doc.data() as MenuItemDto);
  }
  
  async updateMenuItem(id: string, menuItemData: Partial<MenuItemDto>): Promise<MenuItemDto> {
    await this.firebaseService.db.collection('menu-items').doc(id).update(menuItemData);
    return this.getMenuItemById(id);
  }
  
  async updateMenuItemAvailability(id: string, disponivel: boolean): Promise<MenuItemDto> {
    await this.firebaseService.db.collection('menu-items').doc(id).update({ disponivel });
    return this.getMenuItemById(id);
  }
  
  async deleteMenuItem(id: string): Promise<void> {
    await this.firebaseService.db.collection('menu-items').doc(id).delete();
  }
}
