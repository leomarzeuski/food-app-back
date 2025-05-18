// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const payload = { 
      sub: user.id, 
      email: user.email,
      nome: user.nome,
      tipo: user.tipo,
    };
    
    const { senha: _, ...result } = user;
    
    return {
      user: result,
      token: this.jwtService.sign(payload),
    };
  }
}