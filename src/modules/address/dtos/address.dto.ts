import { IsNotEmpty, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  id: string;
  
  @IsString()
  @IsNotEmpty()
  userId: string;
  
  @IsString()
  @IsNotEmpty()
  rua: string;
  
  @IsString()
  @IsNotEmpty()
  numero: string;
  
  @IsString()
  @IsNotEmpty()
  cidade: string;
  
  @IsString()
  @IsNotEmpty()
  estado: string;
  
  @IsString()
  @IsNotEmpty()
  cep: string;
} 