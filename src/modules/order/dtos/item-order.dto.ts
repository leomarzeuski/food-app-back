import { IsNotEmpty, IsString, IsArray, IsEnum, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemOrderDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantidade: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  precoUnit: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  @IsEnum(['novo', 'preparando', 'pronto', 'entregando', 'entregue', 'cancelado'], { 
    message: 'Status deve ser: novo, preparando, pronto, entregando, entregue ou cancelado' 
  })
  @IsNotEmpty()
  status: 'novo' | 'preparando' | 'pronto' | 'entregando' | 'entregue' | 'cancelado';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemOrderDto)
  @IsNotEmpty()
  items: ItemOrderDto[];
} 