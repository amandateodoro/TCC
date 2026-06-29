import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoriaDespesaDto {
  @ApiProperty({
    description: 'Obrigatorio. Nome da categoria de despesa.',
  })
  @IsString()
  nome: string;
}
