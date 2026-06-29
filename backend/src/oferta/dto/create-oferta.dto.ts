import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateOfertaDto {
  @ApiProperty({
    description: 'Obrigatorio. Tipo de celebracao da oferta.',
  })
  @IsString()
  tipoCelebracao: string;

  @ApiProperty({
    description: 'Obrigatorio. Valor total da oferta.',
  })
  @IsString()
  valorTotal: string;

  @ApiProperty({
    description: 'Obrigatorio. Data da oferta no formato AAAA-MM-DD.',
  })
  @IsDateString()
  dataOferta: string;

  @ApiPropertyOptional({
    description: 'Opcional. Observacao sobre a oferta.',
  })
  @IsOptional()
  @IsString()
  observacao?: string;

  @ApiPropertyOptional({
    description: 'Opcional. ID do usuario que cadastrou a oferta.',
  })
  @IsOptional()
  @IsInt()
  usuarioCadastroId?: number;
}
