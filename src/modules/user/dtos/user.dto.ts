import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(['cliente', 'entregador'], { message: 'Tipo deve ser cliente ou entregador' })
  @IsNotEmpty()
  tipo: 'cliente' | 'entregador';
}