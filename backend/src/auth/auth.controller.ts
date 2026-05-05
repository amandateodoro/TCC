import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsuarioService } from '../usuario/usuario.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usuarios: UsuarioService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const usuario = await this.usuarios.validateLogin(dto.nomeDeUsuario, dto.senha);

    if (!usuario) {
      throw new UnauthorizedException('Usuario ou senha invalidos.');
    }

    return { usuario };
  }
}
