import { IsNotEmpty, IsString, IsArray, IsBoolean, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Endereco, Localizacao } from '../../../interfaces/restaurants';

export class EnderecoDto implements Endereco {
  @IsString()
  @IsNotEmpty()
  rua: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsString()
  numero?: string;
}

export class LocalizacaoDto implements Localizacao {
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}

export class RestaurantDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ValidateNested()
  @Type(() => EnderecoDto)
  @IsNotEmpty()
  endereco: EnderecoDto;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  categories: string[];

  @IsBoolean()
  @IsNotEmpty()
  isOpen: boolean;

  @ValidateNested()
  @Type(() => LocalizacaoDto)
  @IsNotEmpty()
  location: LocalizacaoDto;
} 