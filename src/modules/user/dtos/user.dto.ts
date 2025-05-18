import { IsEmail, IsNotEmpty, IsString, IsEnum, MinLength } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  senha: string;

  @IsEnum(['cliente', 'entregador'], { message: 'Tipo deve ser cliente ou entregador' })
  @IsNotEmpty()
  tipo: 'cliente' | 'entregador';
}