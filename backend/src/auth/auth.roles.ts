import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NivelAcesso } from '../usuario/usuario.entity';

// Define o formato do usuario autenticado que fica disponivel em request.user.
export type AuthUser = {
  id: number;
  nomeDeUsuario: string;
  nivelAcesso: NivelAcesso;
};

// Chave usada pelo Nest para marcar rotas publicas, ou seja, rotas sem login obrigatorio.
export const IS_PUBLIC_KEY = 'isPublic';

// Marca uma rota como publica. Exemplo: a rota de login usa @Public().
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Chave usada pelo Nest para guardar quais niveis de acesso uma rota exige.
export const ROLES_KEY = 'roles';

// Marca uma rota com os niveis permitidos. Exemplo: @Roles(NivelAcesso.ADMINISTRADOR).
export const Roles = (...roles: NivelAcesso[]) => SetMetadata(ROLES_KEY, roles);

// Verifica se o usuario logado possui o nivel de acesso exigido pela rota.
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
