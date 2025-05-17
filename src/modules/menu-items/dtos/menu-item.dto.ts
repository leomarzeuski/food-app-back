import { IsNotEmpty, IsString, IsNumber, Min, IsBoolean, IsUrl, IsOptional } from 'class-validator';

export class MenuItemDto {
  @IsString()
  @IsNotEmpty()
  restauranteId: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  preco: number;

  @IsString()
  @IsUrl()
  @IsOptional()
  imagemUrl: string;

  @IsBoolean()
  @IsNotEmpty()
  disponivel: boolean;
} 