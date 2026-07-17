import { Injectable } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import { Contribuicao } from '../contribuicao/contribuicao.entity';
import { ContribuicaoService } from '../contribuicao/contribuicao.service';
import { ContribuinteService } from '../contribuinte/contribuinte.service';
import { Despesa } from '../despesa/despesa.entity';
import { DespesaService } from '../despesa/despesa.service';
import { Oferta } from '../oferta/oferta.entity';
import { OfertaService } from '../oferta/oferta.service';
import {
  drawPdfFooter,
  drawPdfHeader,
  drawPdfSummary,
  drawPdfTable,
  getPdfColumns,
} from './pdf/relatorio-pdf.layout';

type SaldoDiarioRow = {
  id: string;
  data: string;
  contribuicaoVoluntaria: number;
  dizimo: number;
  oferta: number;
  despesa: number;
  saldo: number;
};

@Injectable()
export class RelatorioService {
  constructor(
    private readonly contribuintes: ContribuinteService,
    private readonly contribuicoes: ContribuicaoService,
    private readonly despesas: DespesaService,
    private readonly ofertas: OfertaService,
  ) {}

  async gerar(tipo: string, inicio?: string, fim?: string) {
    const normalized = this.normalizeTipo(tipo);

    if (normalized.includes('anivers')) {
      if (inicio && fim) {
        return this.contribuintes.birthdaysByPeriod(inicio, fim);
      }

      return this.contribuintes.birthdaysByMonth(new Date().getMonth() + 1);
    }

    if (normalized.includes('entrada') || normalized.includes('contrib')) {
      const periodo = this.resolvePeriodoFinanceiro(inicio, fim);
      const [contribuicoes, ofertas] = await Promise.all([
        this.contribuicoes.findAll(periodo.inicio, periodo.fim),
        this.ofertas.findAll(periodo.inicio, periodo.fim),
      ]);

      return [
        ...contribuicoes.map((contribuicao) => ({
          id: `contribuicao-${contribuicao.id}`,
          origem: contribuicao.tipoContribuicao,
          descricao: contribuicao.contribuinte?.nomeCompleto,
          pagamento: contribuicao.formaDePagamento,
          data: contribuicao.dataDePagamento,
          valor: contribuicao.valorContribuicao,
          observacao: contribuicao.observacao,
        })),
        ...ofertas.map((oferta) => ({
          id: `oferta-${oferta.id}`,
          origem: 'Oferta',
          descricao: oferta.tipoCelebracao,
          pagamento: '-',
          data: oferta.dataOferta,
          valor: oferta.valorTotal,
          observacao: oferta.observacao,
        })),
      ].sort((a, b) => b.data.localeCompare(a.data));
    }

    if (normalized.includes('saida') || normalized.includes('desp')) {
      const periodo = this.resolvePeriodoFinanceiro(inicio, fim);
      return this.despesas.findAll(periodo.inicio, periodo.fim);
    }

    if (normalized.includes('saldo')) {
      const periodo = this.resolvePeriodoFinanceiro(inicio, fim);
      const [contribuicoes, ofertas, despesas] = await Promise.all([
        this.contribuicoes.findAll(periodo.inicio, periodo.fim),
        this.ofertas.findAll(periodo.inicio, periodo.fim),
        this.despesas.findAll(periodo.inicio, periodo.fim),
      ]);

      return this.buildSaldoDiario(contribuicoes, ofertas, despesas);
    }

    return [];
  }

  async gerarPdf(tipo: string, inicio?: string, fim?: string): Promise<Buffer> {
    const dados = (await this.gerar(tipo, inicio, fim)) as Record<string, unknown>[];
    const normalized = this.normalizeTipo(tipo);
    const periodo = this.getPeriodoLabel(normalized, inicio, fim);
    const columns = getPdfColumns(normalized);
    const rows = dados.map((row) => this.mapPdfRow(row, normalized));
    const total = this.getPdfTotal(rows, normalized);

    return new Promise((resolve) => {
      const doc = new PDFDocument({
        margin: 40,
        size: 'A4',
        bufferPages: true,
      });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      drawPdfHeader(doc, tipo, periodo);
      drawPdfTable(doc, columns, rows);
      drawPdfSummary(doc, rows.length, total, normalized);
      drawPdfFooter(doc);

      doc.end();
    });
  }

  private normalizeTipo(tipo: string) {
    return tipo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private getPeriodoLabel(normalized: string, inicio?: string, fim?: string) {
    if (inicio && fim) {
      return `${this.formatDate(inicio)} a ${this.formatDate(fim)}`;
    }

    if (
      normalized.includes('anivers') ||
      normalized.includes('entrada') ||
      normalized.includes('contrib') ||
      normalized.includes('saida') ||
      normalized.includes('desp') ||
      normalized.includes('saldo')
    ) {
      return 'Mês atual';
    }

    return 'Todos os registros';
  }

  private mapPdfRow(row: Record<string, unknown>, normalized: string) {
    if (normalized.includes('entrada') || normalized.includes('contrib')) {
      return {
        origem: this.asText(row.origem),
        descricao: this.asText(row.descricao),
        pagamento: this.asText(row.pagamento),
        data: this.formatDate(this.asText(row.data)),
        valor: this.formatCurrency(row.valor),
        valorNumerico: Number(row.valor ?? 0),
      };
    }

    if (normalized.includes('saida') || normalized.includes('desp')) {
      const categoria = row.categoria as { nome?: string } | undefined;

      return {
        categoria: this.asText(categoria?.nome),
        descricao: this.asText(row.descricaoDespesa ?? row.descricao),
        data: this.formatDate(this.asText(row.dataDespesa ?? row.data)),
        valor: this.formatCurrency(row.valorDespesa ?? row.valor),
        valorNumerico: Number(row.valorDespesa ?? row.valor ?? 0),
      };
    }

    if (normalized.includes('saldo')) {
      return {
        data: this.formatDate(this.asText(row.data)),
        contribuicaoVoluntaria: this.formatCurrency(row.contribuicaoVoluntaria),
        dizimo: this.formatCurrency(row.dizimo),
        oferta: this.formatCurrency(row.oferta),
        despesa: this.formatCurrency(row.despesa),
        saldo: this.formatCurrency(row.saldo),
        valorNumerico: Number(row.saldo ?? 0),
      };
    }

    return {
      nome: this.asText(row.nomeCompleto ?? row.nome),
      telefone: this.asText(row.telefone),
      dataNascimento: this.formatDate(this.asText(row.dataDeNascimento)),
    };
  }

  private getPdfTotal(rows: Record<string, unknown>[], normalized: string) {
    if (
      normalized.includes('entrada') ||
      normalized.includes('contrib') ||
      normalized.includes('saida') ||
      normalized.includes('desp') ||
      normalized.includes('saldo')
    ) {
      return rows.reduce((total, row) => total + Number(row.valorNumerico ?? 0), 0);
    }

    return null;
  }

  private formatCurrency(value: unknown) {
    return Number(value ?? 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  private formatDate(value: string) {
    if (!value) {
      return '';
    }

    const [year, month, day] = value.split('-');

    if (!year || !month || !day) {
      return value;
    }

    return `${day}/${month}/${year}`;
  }

  private asText(value: unknown) {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    return String(value);
  }

  private resolvePeriodoFinanceiro(inicio?: string, fim?: string) {
    if (inicio && fim) {
      return { inicio, fim };
    }

    return this.currentMonthPeriod();
  }

  private currentMonthPeriod() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const startMonth = String(month).padStart(2, '0');
    const lastDay = String(new Date(year, month, 0).getDate()).padStart(2, '0');

    return {
      inicio: `${year}-${startMonth}-01`,
      fim: `${year}-${startMonth}-${lastDay}`,
    };
  }

  private buildSaldoDiario(
    contribuicoes: Contribuicao[],
    ofertas: Oferta[],
    despesas: Despesa[],
  ) {
    const rows = new Map<string, SaldoDiarioRow>();

    const getRow = (data: string) => {
      if (!rows.has(data)) {
        rows.set(data, {
          id: data,
          data,
          contribuicaoVoluntaria: 0,
          dizimo: 0,
          oferta: 0,
          despesa: 0,
          saldo: 0,
        });
      }

      return rows.get(data) as SaldoDiarioRow;
    };

    contribuicoes.forEach((contribuicao) => {
      const row = getRow(contribuicao.dataDePagamento);
      const valor = Number(contribuicao.valorContribuicao ?? 0);
      const tipo = this.normalizeTipo(contribuicao.tipoContribuicao ?? '');

      if (tipo.includes('volunt')) {
        row.contribuicaoVoluntaria += valor;
      } else {
        row.dizimo += valor;
      }
    });

    ofertas.forEach((oferta) => {
      const row = getRow(oferta.dataOferta);
      row.oferta += Number(oferta.valorTotal ?? 0);
    });

    despesas.forEach((despesa) => {
      const row = getRow(despesa.dataDespesa);
      row.despesa += Number(despesa.valorDespesa ?? 0);
    });

    return [...rows.values()]
      .map((row) => {
        const saldo = row.contribuicaoVoluntaria + row.dizimo + row.oferta - row.despesa;

        return {
          ...row,
          contribuicaoVoluntaria: row.contribuicaoVoluntaria.toFixed(2),
          dizimo: row.dizimo.toFixed(2),
          oferta: row.oferta.toFixed(2),
          despesa: row.despesa.toFixed(2),
          saldo: saldo.toFixed(2),
        };
      })
      .sort((a, b) => b.data.localeCompare(a.data));
  }
}
