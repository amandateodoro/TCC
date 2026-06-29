import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { RelatorioService } from './relatorio.service';

@ApiTags('Relatorios')
@Controller('relatorios')
export class RelatorioController {
  constructor(private readonly service: RelatorioService) {}

  @ApiQuery({
    name: 'tipo',
    required: true,
    description: 'Tipo de relatorio que deve ser gerado.',
    type: String,
  })
  @ApiQuery({
    name: 'inicio',
    required: false,
    description: 'Data inicial do filtro no formato AAAA-MM-DD.',
    type: String,
  })
  @ApiQuery({
    name: 'fim',
    required: false,
    description: 'Data final do filtro no formato AAAA-MM-DD.',
    type: String,
  })
  @Get()
  gerar(@Query('tipo') tipo: string, @Query('inicio') inicio?: string, @Query('fim') fim?: string) {
    if (!tipo) {
      throw new BadRequestException('Informe o tipo do relatorio.');
    }

    return this.service.gerar(tipo, inicio, fim);
  }
}
