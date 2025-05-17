export interface ItemOrder {
    itemId: string;
    quantidade: number;
    precoUnit: number;
  }
  
  export interface Order {
    id: string;
    userId: string;
    restaurantId: string;
    status: 'novo' | 'preparando' | 'pronto' | 'entregando' | 'entregue' | 'cancelado';
    items: ItemOrder[];
    createdAt: string;
  }