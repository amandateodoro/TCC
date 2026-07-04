import { Module } from '@nestjs/common';
import { ContribuicaoModule } from '../contribuicao/contribuicao.module';
import { ContribuinteModule } from '../contribuinte/contribuinte.module';
import { DespesaModule } from '../despesa/despesa.module';
import { OfertaModule } from '../oferta/oferta.module';
import { RelatorioController } from './relatorio.controller';
import { RelatorioService } from './relatorio.service';

@Module({
  imports: [ContribuinteModule, ContribuicaoModule, DespesaModule, OfertaModule],
  controllers: [RelatorioController],
  providers: [RelatorioService],
})
export class RelatorioModule {}
