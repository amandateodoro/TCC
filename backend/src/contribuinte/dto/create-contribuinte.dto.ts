import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
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
  @IsNotEmpty()
  nomeCompleto: string;

  @ApiProperty({
    description: 'Obrigatorio. Endereco do contribuinte.',
  })
  @IsString()
  @IsNotEmpty()
  endereco: string;

  @ApiProperty({
    description: 'Obrigatorio. Telefone do contribuinte.',
  })
  @IsString()
  @IsNotEmpty()
  telefone: string;

  @ApiProperty({
    description: 'Obrigatorio. Data de nascimento no formato AAAA-MM-DD.',
  })
  @IsDateString()
  dataDeNascimento: string;

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
  @ArrayNotEmpty()
  @IsInt({ each: true })
  profissaoConjugeIds?: number[];

  @ApiProperty({
    description: 'Obrigatorio. IDs das profissoes do contribuinte.',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  profissaoIds: number[];
}
