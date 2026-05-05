import { IsString } from 'class-validator';

export class CreateProfissaoDto {
  @IsString()
  nome: string;
}
