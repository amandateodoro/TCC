import { Injectable } from '@nestjs/common';
import { ContribuicaoService } from '../contribuicao/contribuicao.service';
import { ContribuinteService } from '../contribuinte/contribuinte.service';
import { DespesaService } from '../despesa/despesa.service';

@Injectable()
export class RelatorioService {
  constructor(
    private readonly contribuintes: ContribuinteService,
    private readonly contribuicoes: ContribuicaoService,
    private readonly despesas: DespesaService,
  ) {}

  gerar(tipo: string, inicio?: string, fim?: string) {
    const normalized = tipo.toLowerCase();

    if (normalized.includes('anivers')) {
      if (inicio && fim) {
        return this.contribuintes.birthdaysByPeriod(inicio, fim);
      }

      return this.contribuintes.birthdaysByMonth(new Date().getMonth() + 1);
    }

    if (normalized.includes('contrib')) {
      return this.contribuicoes.findAll(inicio, fim);
    }

    if (normalized.includes('desp')) {
      return this.despesas.findAll(inicio, fim);
    }

    return [];
  }
}
