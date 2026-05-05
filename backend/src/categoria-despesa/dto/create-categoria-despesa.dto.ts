import { IsString } from 'class-validator';

export class CreateCategoriaDespesaDto {
  @IsString()
  nome: string;
}
