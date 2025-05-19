import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class AddressDto {
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  entityId: string; 

  @IsString()
  @IsNotEmpty()
  entityType: 'user' | 'restaurant'; 

  @IsString()
  @IsOptional()
  apelido?: string;

  @IsString()
  @IsNotEmpty()
  rua: string;

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  @IsNotEmpty()
  bairro: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsNotEmpty()
  cep: string;
  
  @IsBoolean()
  @IsOptional()
  principal?: boolean;
  
  @IsString()
  @IsOptional()
  createdAt?: string;
  
  @IsString()
  @IsOptional()
  updatedAt?: string;
}