import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContribuicaoDto {
  @ApiProperty({
    description: 'Obrigatorio. Tipo da contribuicao.',
  })
  @IsString()
  @IsNotEmpty()
  tipoContribuicao: string;

  @ApiProperty({
    description: 'Obrigatorio. Valor da contribuicao.',
  })
  @IsString()
  @IsNotEmpty()
  valorContribuicao: string;

  @ApiProperty({
    description: 'Obrigatorio. Forma de pagamento.',
  })
  @IsNotEmpty()
  @IsString()
  formaDePagamento: string;

  @ApiProperty({
    description: 'Obrigatorio. Data de pagamento no formato AAAA-MM-DD.',
  })
  @IsDateString()
  dataDePagamento: string;

  @ApiPropertyOptional({
    description: 'Opcional. Observacao sobre a contribuicao.',
  })
  @IsOptional()
  @IsString()
  observacao?: string;

  @ApiPropertyOptional({
    description: 'Opcional. ID do usuario que cadastrou a contribuicao.',
  })
  @IsOptional()
  @IsInt()
  usuarioCadastroId?: number;

  @ApiProperty({
    description: 'Obrigatorio. ID do contribuinte vinculado a contribuicao.',
  })
  @IsInt()
  contribuinteId: number;
}
