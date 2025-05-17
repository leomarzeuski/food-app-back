export interface Localizacao {
    latitude: number;
    longitude: number;
  }
  
  export interface Endereco {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
    numero?: string;
  }
  
  export interface Restaurante {
    id: string;
    nome: string;
    endereco: Endereco;
    categories: string[];
    isOpen: boolean;
    location: Localizacao;
    createdAt: string;
  }