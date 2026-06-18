import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser } from './auth-user.type';

type JwtPayload = {
  sub: number;
  nomeDeUsuario: string;
  nivelAcesso: AuthUser['nivelAcesso'];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'tcc-dev-secret'),
    });
  }

  validate(payload: JwtPayload): AuthUser {
    return {
      id: payload.sub,
      nomeDeUsuario: payload.nomeDeUsuario,
      nivelAcesso: payload.nivelAcesso,
    };
  }
}
