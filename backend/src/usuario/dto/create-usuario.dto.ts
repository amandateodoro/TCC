import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { NivelAcesso } from '../usuario.entity';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Obrigatório. Nome completo do usuário.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome completo.' })
  nomeCompleto: string;

  @ApiProperty({
    description: 'Obrigatório. Nome usado para login.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome de usuário.' })
  nomeDeUsuario: string;

  @ApiProperty({
    description: 'Obrigatório. Senha com no mínimo 6 caracteres.',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'Informe a senha.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senha: string;

  @ApiProperty({
    description: 'Obrigatório. E-mail do usuário.',
  })
  @IsNotEmpty({ message: 'Informe o e-mail.' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @ApiProperty({
    description: 'Obrigatório. Nível de acesso do usuário.',
    enum: NivelAcesso,
  })
  @IsNotEmpty({ message: 'Selecione o nível de acesso.' })
  @IsEnum(NivelAcesso, {
    message: 'Selecione um nível de acesso válido.',
  })
  nivelAcesso: NivelAcesso;

  @ApiProperty({
    description: 'Obrigatório. Telefone do usuário.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Informe o telefone.' })
  telefone: string;
}
