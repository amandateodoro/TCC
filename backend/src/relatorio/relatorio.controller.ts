import { BadRequestException, Controller, Get, Query, Res } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RelatorioService } from './relatorio.service';

@ApiTags('Relatórios')
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
    this.validateQuery(tipo, inicio, fim);

    return this.service.gerar(tipo, inicio, fim);
  }

  @ApiQuery({
    name: 'tipo',
    required: true,
    description: 'Tipo de relatorio que deve ser gerado em PDF.',
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
  @Get('pdf')
  async gerarPdf(
    @Query('tipo') tipo: string,
    @Query('inicio') inicio: string | undefined,
    @Query('fim') fim: string | undefined,
    @Res() res: Response,
  ) {
    this.validateQuery(tipo, inicio, fim);

    const pdfBuffer = await this.service.gerarPdf(tipo, inicio, fim);
    const fileName = `relatorio-${Date.now()}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  private validateQuery(tipo: string, inicio?: string, fim?: string) {
    if (!tipo) {
      throw new BadRequestException('Informe o tipo do relatorio.');
    }

    if ((inicio && !fim) || (!inicio && fim)) {
      throw new BadRequestException('Informe a data inicial e a data final para gerar o relatorio.');
    }

    if (inicio && fim && fim < inicio) {
      throw new BadRequestException('A data final nao pode ser anterior a data inicial.');
    }
  }
}
