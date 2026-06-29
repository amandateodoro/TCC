import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { NivelAcesso } from '../usuario.entity';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Obrigatorio. Nome completo do usuario.',
  })
  @IsString()
  nomeCompleto: string;

  @ApiProperty({
    description: 'Obrigatorio. Nome usado para login.',
  })
  @IsString()
  nomeDeUsuario: string;

  @ApiProperty({
    description: 'Obrigatorio. Senha com no minimo 6 caracteres.',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiProperty({
    description: 'Obrigatorio. E-mail do usuario.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Obrigatorio. Nivel de acesso do usuario.',
    enum: NivelAcesso,
  })
  @IsEnum(NivelAcesso)
  nivelAcesso: NivelAcesso;

  @ApiPropertyOptional({
    description: 'Opcional. Telefone do usuario.',
  })
  @IsOptional()
  @IsString()
  telefone?: string;
}
