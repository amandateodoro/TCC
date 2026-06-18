import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarios: UsuarioService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuarios.validateLogin(
      dto.nomeDeUsuario,
      dto.senha,
    );

    if (!usuario) {
      throw new UnauthorizedException('Usuario ou senha invalidos.');
    }

    const accessToken = await this.jwt.signAsync({
      sub: usuario.id,
      nomeDeUsuario: usuario.nomeDeUsuario,
      nivelAcesso: usuario.nivelAcesso,
    });

    return { accessToken, usuario };
  }
}
