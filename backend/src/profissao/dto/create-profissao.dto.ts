import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProfissaoDto {
  @ApiProperty({
    description: 'Obrigatorio. Nome da profissao.',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Obrigatorio. Codigo CBO da profissao.',
  })
  @IsString()
  codigoCbo: string;
}
