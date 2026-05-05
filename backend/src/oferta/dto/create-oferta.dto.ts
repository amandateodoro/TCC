import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateOfertaDto {
  @IsString()
  tipoCelebracao: string;

  @IsString()
  valorTotal: string;

  @IsDateString()
  dataOferta: string;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsOptional()
  @IsInt()
  usuarioCadastroId?: number;
}
