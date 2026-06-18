import { NivelAcesso } from '../usuario/usuario.entity';

export type AuthUser = {
  id: number;
  nomeDeUsuario: string;
  nivelAcesso: NivelAcesso;
};
