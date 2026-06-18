import { IsOptional, IsString } from 'class-validator';

export class CreateProfissaoDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  codigoCbo?: string;
}
