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
  @IsString()
  nomeCompleto: string;

  @IsString()
  endereco?: string;

  @IsString()
  telefone?: string;

  @IsDateString()
  dataDeNascimento?: string;

  @IsOptional()
  @IsBoolean()
  casado?: boolean;

  @ValidateIf((dto: CreateContribuinteDto) => dto.casado === true)
  @IsString()
  @IsNotEmpty()
  nomeConjuge?: string;

  @ValidateIf((dto: CreateContribuinteDto) => dto.casado === true)
  @IsString()
  @IsNotEmpty()
  telefoneConjuge?: string;

  @ValidateIf((dto: CreateContribuinteDto) => dto.casado === true)
  @IsDateString()
  dataNascimentoConjuge?: string;

  @ValidateIf((dto: CreateContribuinteDto) => dto.casado === true)
  @IsArray()
  @IsInt({ each: true })
  profissaoConjugeIds?: number[];

  @IsArray()
  @IsInt({ each: true })
  profissaoIds: number[];

}
