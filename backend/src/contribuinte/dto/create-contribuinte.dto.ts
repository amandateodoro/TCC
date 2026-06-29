import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateContribuinteDto {
  @ApiProperty({
    description: 'Obrigatorio. Nome completo do contribuinte.',
  })
  @IsString()
  nomeCompleto: string;

  @ApiPropertyOptional({
    description: 'Opcional. Endereco do contribuinte.',
  })
  @IsString()
  endereco?: string;

  @ApiPropertyOptional({
    description: 'Opcional. Telefone do contribuinte.',
  })
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Opcional. Data de nascimento no formato AAAA-MM-DD.',
  })
  @IsDateString()
  dataDeNascimento?: string;

  @ApiPropertyOptional({
    description: 'Opcional. Informe true quando o contribuinte for casado.',
  })
  @IsOptional()
  @IsBoolean()
  casado?: boolean;

  @ApiPropertyOptional({
    description: 'Obrigatorio somente quando casado for true. Nome do conjuge.',
  })
  @ValidateIf((dto: CreateContribuinteDto) => dto.casado === true)
  @IsString()
  @IsNotEmpty()
  nomeConjuge?: string;

  @ApiPropertyOptional({
    description: 'Obrigatorio somente quando casado for true. Telefone do conjuge.',
  })
  @ValidateIf((dto: CreateContribuinteDto) => dto.casado === true)
  @IsString()
  @IsNotEmpty()
  telefoneConjuge?: string;

  @ApiPropertyOptional({
    description: 'Obrigatorio somente quando casado for true. Data de nascimento do conjuge no formato AAAA-MM-DD.',
  })
  @ValidateIf((dto: CreateContribuinteDto) => dto.casado === true)
  @IsDateString()
  dataNascimentoConjuge?: string;

  @ApiPropertyOptional({
    description: 'Obrigatorio somente quando casado for true. IDs das profissoes do conjuge.',
    type: [Number],
  })
  @ValidateIf((dto: CreateContribuinteDto) => dto.casado === true)
  @IsArray()
  @IsInt({ each: true })
  profissaoConjugeIds?: number[];

  @ApiProperty({
    description: 'Obrigatorio. IDs das profissoes do contribuinte.',
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  profissaoIds: number[];
}
