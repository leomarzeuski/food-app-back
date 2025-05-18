export interface Address {
    id: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    apelido?: string;
  }
  
  export interface User {
    id: string;
    nome: string;
    email: string;
    senha: string;
    tipo: 'cliente' | 'entregador';
    createdAt: string;
    telefone?: string;
    enderecos?: Address[];
  }