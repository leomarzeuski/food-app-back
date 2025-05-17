export interface User {
    id: string;
    nome: string;
    email: string;
    tipo: 'cliente' | 'entregador';
    createdAt: string;
  }