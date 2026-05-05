import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  nomeDeUsuario: string;

  @IsString()
  senha: string;
}
