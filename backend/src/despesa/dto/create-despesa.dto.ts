import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDespesaDto {
  @IsString()
  valorDespesa: string;

  @IsDateString()
  dataDespesa: string;

  @IsOptional()
  @IsString()
  descricaoDespesa?: string;

  @IsInt()
  categoriaId?: number;

  @IsString()
  categoriaNome?: string;

  @IsInt()
  usuarioId: number;
}
