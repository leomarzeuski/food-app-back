// modules/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dtos/user.dto';


class LoginDto {
  email: string;
  senha: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.senha);
  }
  
  @Post('register')
  async register(@Body() registerDto: UserDto) {
    const user = await this.userService.registerUser(registerDto);
    
    const payload = { 
      sub: user.id, 
      email: user.email,
      nome: user.nome,
      tipo: user.tipo,
    };
    
    return {
      user: user,
      token: this.authService.jwtService.sign(payload),
    };
  }
}