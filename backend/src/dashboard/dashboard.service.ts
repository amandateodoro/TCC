import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContribuicaoService } from '../contribuicao/contribuicao.service';
import { Contribuinte } from '../contribuinte/contribuinte.entity';
import { ContribuinteService } from '../contribuinte/contribuinte.service';
import { DespesaService } from '../despesa/despesa.service';
import { OfertaService } from '../oferta/oferta.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Contribuinte)
    private readonly contribuintesRepository: Repository<Contribuinte>,
    private readonly contribuicoes: ContribuicaoService,
    private readonly despesas: DespesaService,
    private readonly ofertas: OfertaService,
    private readonly contribuintes: ContribuinteService,
  ) {}

  async getSummary(periodo: { ano: number; mes: number }) {
    const [totalContribuintes, totalContribuicoes, totalOfertas, totalDespesas, aniversariantes] =
      await Promise.all([
        this.contribuintesRepository.count(),
        this.contribuicoes.sumByMonth(periodo.ano, periodo.mes),
        this.ofertas.sumByMonth(periodo.ano, periodo.mes),
        this.despesas.sumByMonth(periodo.ano, periodo.mes),
        this.contribuintes.birthdaysByMonth(periodo.mes),
      ]);

    return {
      periodo,
      totalContribuintes,
      totalArrecadadoMes: (
        Number(totalContribuicoes?.total ?? 0) + Number(totalOfertas?.total ?? 0)
      ).toFixed(2),
      saldoMes: (
        Number(totalContribuicoes?.total ?? 0) + Number(totalOfertas?.total ?? 0)
        - Number(totalDespesas?.total ?? 0)
      ).toFixed(2),
      totalContribuicoesMes: Number(totalContribuicoes?.total ?? 0).toFixed(2),
      totalOfertasMes: Number(totalOfertas?.total ?? 0).toFixed(2),
      totalDespesasMes: Number(totalDespesas?.total ?? 0).toFixed(2),
      aniversariantes,
    };
  }
}
