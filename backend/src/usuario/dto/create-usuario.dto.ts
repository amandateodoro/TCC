import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { NivelAcesso } from '../usuario.entity';

export class CreateUsuarioDto {
  @IsString()
  nomeCompleto: string;

  @IsString()
  nomeDeUsuario: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsEmail()
  email: string;

  @IsEnum(NivelAcesso)
  nivelAcesso: NivelAcesso;

  @IsOptional()
  @IsString()
  telefone?: string;
}
