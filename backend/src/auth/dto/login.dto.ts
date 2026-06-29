import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Obrigatorio. Nome de usuario usado no login.',
  })
  @IsString()
  nomeDeUsuario: string;

  @ApiProperty({
    description: 'Obrigatorio. Senha do usuario.',
  })
  @IsString()
  senha: string;
}
