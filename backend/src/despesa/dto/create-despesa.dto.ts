import { IsArray, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDespesaDto {
  @IsString()
  valorDespesa: string;

  @IsDateString()
  dataDespesa: string;

  @IsOptional()
  @IsString()
  descricaoDespesa?: string;

  @IsOptional()
  @IsInt()
  categoriaId?: number;

  @IsOptional()
  @IsString()
  categoriaNome?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  usuarioIds?: number[];
}
