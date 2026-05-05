import { IsArray, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateContribuicaoDto {
  @IsString()
  tipoContribuicao: string;

  @IsString()
  valorContribuicao: string;

  @IsString()
  formaDePagamento: string;

  @IsDateString()
  dataDePagamento: string;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsOptional()
  @IsInt()
  usuarioCadastroId?: number;

  @IsArray()
  @IsInt({ each: true })
  contribuinteIds: number[];
}
