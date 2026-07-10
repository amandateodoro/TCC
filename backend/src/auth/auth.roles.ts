import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NivelAcesso } from '../usuario/usuario.entity';

// Define o formato do usuario autenticado que fica disponível em request.user.
export type AuthUser = {
  id: number;
  nomeDeUsuario: string;
  nivelAcesso: NivelAcesso;
};

// Para marcar rotas sem login obrigatório.
export const IS_PUBLIC_KEY = 'isPublic';

// Setar uma rota como publica.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Para guardar quais níveis de acesso uma rota exige.
export const ROLES_KEY = 'roles';

// Setar uma rota com os níveis de acesso permitidos.
export const Roles = (...roles: NivelAcesso[]) => SetMetadata(ROLES_KEY, roles);

// Verifica se o usuário logado possui o nível de acesso exigido pela rota.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<NivelAcesso[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    return Boolean(
      request.user && requiredRoles.includes(request.user.nivelAcesso),
    );
  }
}
