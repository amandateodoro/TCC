import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContribuicaoModule } from '../contribuicao/contribuicao.module';
import { Contribuinte } from '../contribuinte/contribuinte.entity';
import { ContribuinteModule } from '../contribuinte/contribuinte.module';
import { DespesaModule } from '../despesa/despesa.module';
import { OfertaModule } from '../oferta/oferta.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contribuinte]),
    ContribuinteModule,
    ContribuicaoModule,
    DespesaModule,
    OfertaModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
