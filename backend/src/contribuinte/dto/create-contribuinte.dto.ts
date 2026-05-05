import { IsBoolean, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateContribuinteDto {
  @IsString()
  nomeCompleto: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsDateString()
  dataDeNascimento?: string;

  @IsOptional()
  @IsBoolean()
  casado?: boolean;

  @IsOptional()
  @IsString()
  nomeConjuge?: string;

  @IsOptional()
  @IsString()
  telefoneConjuge?: string;

  @IsOptional()
  @IsDateString()
  dataNascimentoConjuge?: string;

  @IsOptional()
  @IsInt()
  profissaoId?: number;

  @IsOptional()
  @IsString()
  profissaoNome?: string;

  @IsOptional()
  @IsInt()
  usuarioCadastroId?: number;
}
