import PDFDocument = require('pdfkit');

export type PdfColumn = {
  key: string;
  label: string;
  width: number;
  align?: 'left' | 'right' | 'center';
};

const COLORS = {
  text: '#141b34',
  mutedText: '#6d7386',
  lightText: '#6d7386',
  footerText: '#8f8f96',
  headerBackground: '#faf7f4',
  tableHeader: '#ad8866',
  tableHeaderText: '#fffaf6',
  evenRow: '#ffffff',
  oddRow: '#fbf9f6',
  border: '#e6dacf',
  summaryBorder: '#d8c5b4',
};

export function getPdfColumns(normalized: string): PdfColumn[] {
  if (normalized.includes('entrada') || normalized.includes('contrib')) {
    return [
      { key: 'origem', label: 'Origem', width: 72 },
      { key: 'descricao', label: 'Descrição', width: 176 },
      { key: 'pagamento', label: 'Pagamento', width: 74 },
      { key: 'data', label: 'Data', width: 70 },
      { key: 'valor', label: 'Valor', width: 83, align: 'right' },
    ];
  }
  if (normalized.includes('saida') || normalized.includes('desp')) {
    return [
      { key: 'categoria', label: 'Categoria', width: 130 },
      { key: 'descricao', label: 'Descrição', width: 220 },
      { key: 'data', label: 'Data', width: 75 },
      { key: 'valor', label: 'Valor', width: 90, align: 'right' },
    ];
  }
  if (normalized.includes('saldo')) {
    return [
      { key: 'data', label: 'Data', width: 66 },
      { key: 'contribuicaoVoluntaria', label: 'Contrib. volunt.', width: 86, align: 'right' },
      { key: 'dizimo', label: 'Dízimo', width: 74, align: 'right' },
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

export function drawPdfHeader(doc: PDFKit.PDFDocument, tipo: string, periodo: string) {
  doc.rect(40, 40, 515, 76).fill(COLORS.headerBackground);
  doc.fillColor('#945a22').font('Helvetica-Bold').fontSize(17)
    .text(`Relatório de ${tipo}`, 60, 60);
  doc.font('Helvetica').fontSize(10).fillColor(COLORS.mutedText)
    .text(`Período: ${periodo}`, 60, 88);
  doc.fontSize(9).fillColor(COLORS.lightText)
    .text(`Gerado em ${formatDate(new Date().toISOString().slice(0, 10))}`, 405, 88, {
      width: 130,
      align: 'right',
    });
}

export function drawPdfTable(doc: PDFKit.PDFDocument, columns: PdfColumn[], rows: Record<string, unknown>[]) {
  let y = drawPdfTableHeader(doc, columns, 145);
  if (!rows.length) {
    doc.font('Helvetica').fontSize(10).fillColor(COLORS.lightText)
      .text('Nenhum registro encontrado para os filtros informados.', 50, y + 14);
    return;
  }
  rows.forEach((row, index) => {
    const rowHeight = getPdfRowHeight(doc, columns, row);
    if (y + rowHeight > 730) {
      doc.addPage();
      y = drawPdfTableHeader(doc, columns, 60);
    }
    doc.rect(40, y, 515, rowHeight).fill(index % 2 === 0 ? COLORS.evenRow : COLORS.oddRow);
    let x = 50;
    columns.forEach((column) => {
      doc.font('Helvetica').fontSize(8.5).fillColor(COLORS.text)
        .text(asText(row[column.key]), x, y + 8, {
          width: column.width - 10,
          align: column.align ?? 'left',
        });
      x += column.width;
    });
    doc.moveTo(40, y + rowHeight).lineTo(555, y + rowHeight)
      .strokeColor(COLORS.border).lineWidth(0.5).stroke();
    y += rowHeight;
  });
  doc.y = y + 18;
}

export function drawPdfSummary(doc: PDFKit.PDFDocument, count: number, total: number | null, normalized: string) {
  if (doc.y > 720) {
    doc.addPage();
    doc.y = 60;
  }
  doc.moveTo(40, doc.y).lineTo(555, doc.y)
    .strokeColor(COLORS.summaryBorder).lineWidth(0.7).stroke();
  doc.moveDown(0.8);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.text)
    .text(`Total de registros: ${count}`, 40, doc.y);
  if (total !== null) {
    const label = normalized.includes('saldo') ? 'Saldo total' : 'Total';
    doc.fontSize(11).fillColor(COLORS.text)
      .text(`${label}: ${formatCurrency(total)}`, 360, doc.y - 12, { width: 195, align: 'right' });
  }
}

export function drawPdfFooter(doc: PDFKit.PDFDocument) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i += 1) {
    doc.switchToPage(i);
    doc.font('Helvetica').fontSize(8).fillColor(COLORS.footerText)
      .text(`Página ${i + 1} de ${range.count}`, 40, 780, { width: 515, align: 'center' });
  }
}

function drawPdfTableHeader(doc: PDFKit.PDFDocument, columns: PdfColumn[], y: number) {
  doc.rect(40, y, 515, 26).fill(COLORS.tableHeader);
  let x = 50;
  columns.forEach((column) => {
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLORS.tableHeaderText)
      .text(column.label, x, y + 9, { width: column.width - 10, align: column.align ?? 'left' });
    x += column.width;
  });
  return y + 26;
}

function getPdfRowHeight(doc: PDFKit.PDFDocument, columns: PdfColumn[], row: Record<string, unknown>) {
  const heights = columns.map((column) => doc.heightOfString(asText(row[column.key]), {
    width: column.width - 10,
    align: column.align ?? 'left',
  }));
  return Math.max(26, Math.max(...heights) + 16);
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function asText(value: unknown) {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}
