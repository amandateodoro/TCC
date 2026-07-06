import { Injectable } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import { Contribuicao } from '../contribuicao/contribuicao.entity';
import { ContribuicaoService } from '../contribuicao/contribuicao.service';
import { ContribuinteService } from '../contribuinte/contribuinte.service';
import { Despesa } from '../despesa/despesa.entity';
import { DespesaService } from '../despesa/despesa.service';
import { Oferta } from '../oferta/oferta.entity';
import { OfertaService } from '../oferta/oferta.service';

type SaldoDiarioRow = {
  id: string;
  data: string;
  contribuicaoVoluntaria: number;
  dizimo: number;
  oferta: number;
  despesa: number;
  saldo: number;
};

type PdfColumn = {
  key: string;
  label: string;
  width: number;
  align?: 'left' | 'right' | 'center';
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
    const columns = this.getPdfColumns(normalized);
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

      this.drawPdfHeader(doc, tipo, periodo);
      this.drawPdfTable(doc, columns, rows);
      this.drawPdfSummary(doc, rows.length, total, normalized);
      this.drawPdfFooter(doc);

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
      return 'Mes atual';
    }

    return 'Todos os registros';
  }

  private getPdfColumns(normalized: string): PdfColumn[] {
    if (normalized.includes('entrada') || normalized.includes('contrib')) {
      return [
        { key: 'origem', label: 'Origem', width: 72 },
        { key: 'descricao', label: 'Descricao', width: 176 },
        { key: 'pagamento', label: 'Pagamento', width: 74 },
        { key: 'data', label: 'Data', width: 70 },
        { key: 'valor', label: 'Valor', width: 83, align: 'right' },
      ];
    }

    if (normalized.includes('saida') || normalized.includes('desp')) {
      return [
        { key: 'categoria', label: 'Categoria', width: 130 },
        { key: 'descricao', label: 'Descricao', width: 220 },
        { key: 'data', label: 'Data', width: 75 },
        { key: 'valor', label: 'Valor', width: 90, align: 'right' },
      ];
    }

    if (normalized.includes('saldo')) {
      return [
        { key: 'data', label: 'Data', width: 66 },
        { key: 'contribuicaoVoluntaria', label: 'Contrib. volunt.', width: 86, align: 'right' },
        { key: 'dizimo', label: 'Dizimo', width: 74, align: 'right' },
        { key: 'oferta', label: 'Oferta', width: 74, align: 'right' },
        { key: 'despesa', label: 'Despesa', width: 82, align: 'right' },
        { key: 'saldo', label: 'Saldo', width: 82, align: 'right' },
      ];
    }

    return [
      { key: 'nome', label: 'Nome', width: 245 },
      { key: 'telefone', label: 'Telefone', width: 125 },
      { key: 'dataNascimento', label: 'Nascimento', width: 110 },
    ];
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

  private drawPdfHeader(doc: PDFKit.PDFDocument, tipo: string, periodo: string) {
    doc.rect(40, 40, 515, 76).fill('#f3f4f6');

    doc
      .fillColor('#111827')
      .font('Helvetica-Bold')
      .fontSize(17)
      .text('Sistema de Gestao Paroquial', 60, 58);

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#4b5563')
      .text(`Relatorio de ${tipo}`, 60, 82)
      .text(`Periodo: ${periodo}`, 60, 98);

    doc
      .fontSize(9)
      .fillColor('#6b7280')
      .text(`Gerado em ${this.formatDate(new Date().toISOString().slice(0, 10))}`, 405, 82, {
        width: 130,
        align: 'right',
      });
  }

  private drawPdfTable(
    doc: PDFKit.PDFDocument,
    columns: PdfColumn[],
    rows: Record<string, unknown>[],
  ) {
    let y = 145;

    y = this.drawPdfTableHeader(doc, columns, y);

    if (!rows.length) {
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#6b7280')
        .text('Nenhum registro encontrado para os filtros informados.', 50, y + 14);
      return;
    }

    rows.forEach((row, index) => {
      const rowHeight = this.getPdfRowHeight(doc, columns, row);

      if (y + rowHeight > 730) {
        doc.addPage();
        y = 60;
        y = this.drawPdfTableHeader(doc, columns, y);
      }

      doc.rect(40, y, 515, rowHeight).fill(index % 2 === 0 ? '#ffffff' : '#f9fafb');

      let x = 50;
      columns.forEach((column) => {
        doc
          .font('Helvetica')
          .fontSize(8.5)
          .fillColor('#111827')
          .text(this.asText(row[column.key]), x, y + 8, {
            width: column.width - 10,
            align: column.align ?? 'left',
          });
        x += column.width;
      });

      doc
        .moveTo(40, y + rowHeight)
        .lineTo(555, y + rowHeight)
        .strokeColor('#e5e7eb')
        .lineWidth(0.5)
        .stroke();

      y += rowHeight;
    });

    doc.y = y + 18;
  }

  private drawPdfTableHeader(doc: PDFKit.PDFDocument, columns: PdfColumn[], y: number) {
    doc.rect(40, y, 515, 26).fill('#2563eb');

    let x = 50;
    columns.forEach((column) => {
      doc
        .font('Helvetica-Bold')
        .fontSize(8.5)
        .fillColor('#ffffff')
        .text(column.label, x, y + 9, {
          width: column.width - 10,
          align: column.align ?? 'left',
        });
      x += column.width;
    });

    return y + 26;
  }

  private getPdfRowHeight(
    doc: PDFKit.PDFDocument,
    columns: PdfColumn[],
    row: Record<string, unknown>,
  ) {
    const heights = columns.map((column) =>
      doc.heightOfString(this.asText(row[column.key]), {
        width: column.width - 10,
        align: column.align ?? 'left',
      }),
    );

    return Math.max(26, Math.max(...heights) + 16);
  }

  private drawPdfSummary(
    doc: PDFKit.PDFDocument,
    count: number,
    total: number | null,
    normalized: string,
  ) {
    if (doc.y > 720) {
      doc.addPage();
      doc.y = 60;
    }

    doc
      .moveTo(40, doc.y)
      .lineTo(555, doc.y)
      .strokeColor('#d1d5db')
      .lineWidth(0.7)
      .stroke();

    doc.moveDown(0.8);

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor('#111827')
      .text(`Total de registros: ${count}`, 40, doc.y);

    if (total !== null) {
      const label = normalized.includes('saldo') ? 'Saldo total' : 'Total';

      doc
        .fontSize(11)
        .fillColor('#111827')
        .text(`${label}: ${this.formatCurrency(total)}`, 360, doc.y - 12, {
          width: 195,
          align: 'right',
        });
    }
  }

  private drawPdfFooter(doc: PDFKit.PDFDocument) {
    const range = doc.bufferedPageRange();

    for (let i = range.start; i < range.start + range.count; i += 1) {
      doc.switchToPage(i);
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#9ca3af')
        .text(`Pagina ${i + 1} de ${range.count}`, 40, 780, {
          width: 515,
          align: 'center',
        });
    }
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
