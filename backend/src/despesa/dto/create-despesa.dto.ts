import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDespesaDto {
  @ApiProperty({
    description: 'Obrigatorio. Valor da despesa.',
  })
  @IsString()
  @IsNotEmpty()
  valorDespesa: string;

  @ApiProperty({
    description: 'Obrigatorio. Data da despesa no formato AAAA-MM-DD.',
  })
  @IsDateString()
  dataDespesa: string;

  @ApiPropertyOptional({
    description: 'Opcional. Descricao livre sobre a despesa.',
  })
  @IsOptional()
  @IsString()
  descricaoDespesa?: string;

  @ApiPropertyOptional({
    description: 'Opcional. ID de uma categoria de despesa ja cadastrada.',
  })
  @IsOptional()
  @IsInt()
  categoriaId?: number;

  @ApiPropertyOptional({
    description: 'Opcional. Nome da categoria. Se nao existir, sera criada automaticamente.',
  })
  @IsOptional()
  @IsString()
  categoriaNome?: string;

  @ApiProperty({
    description: 'Obrigatorio. ID do usuario responsavel pelo cadastro da despesa.',
  })
  @IsInt()
  usuarioId: number;
}
