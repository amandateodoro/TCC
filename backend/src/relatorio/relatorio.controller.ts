import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { RelatorioService } from './relatorio.service';

@Controller('relatorios')
export class RelatorioController {
  constructor(private readonly service: RelatorioService) {}

  @Get()
  gerar(@Query('tipo') tipo: string, @Query('inicio') inicio?: string, @Query('fim') fim?: string) {
    if (!tipo) {
      throw new BadRequestException('Informe o tipo do relatorio.');
    }

    return this.service.gerar(tipo, inicio, fim);
  }
}
