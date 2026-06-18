import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync';
import dataSource from '../database/data-source';
import { Profissao } from './profissao.entity';

type CsvRow = Record<string, string>;

const CODE_HEADERS = ['codigo', 'codigo_cbo', 'cod_cbo', 'cbo', 'cod_ocupacao'];
const NAME_HEADERS = [
  'titulo',
  'nome',
  'nome_profissao',
  'ocupacao',
  'titulo_ocupacao',
];

async function bootstrap() {
  const filePath = resolve(
    process.cwd(),
    process.argv[2] ?? 'data/cbo/cbo-ocupacoes.csv',
  );

  if (!existsSync(filePath)) {
    throw new Error(`Arquivo CBO nao encontrado: ${filePath}`);
  }

  const content = decodeCsv(readFileSync(filePath)).replace(/^\uFEFF/, '');
  const delimiter = detectDelimiter(content);
  const rows = parse(content, {
    columns: (headers: string[]) => headers.map(normalizeHeader),
    delimiter,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as CsvRow[];

  if (!rows.length) {
    throw new Error('O arquivo CBO nao possui registros.');
  }

  const codeHeader = findHeader(rows[0], CODE_HEADERS);
  const nameHeader = findHeader(rows[0], NAME_HEADERS);

  if (!codeHeader || !nameHeader) {
    throw new Error(
      `Cabecalhos nao reconhecidos. Esperados codigo CBO e nome/titulo. Encontrados: ${Object.keys(rows[0]).join(', ')}`,
    );
  }

  await dataSource.initialize();
  const repository = dataSource.getRepository(Profissao);
  let inserted = 0;
  let updated = 0;
  let ignored = 0;
  let invalid = 0;

  try {
    for (const row of rows) {
      const codigoCbo = normalizeCode(row[codeHeader]);
      const nome = normalizeName(row[nameHeader]);

      if (!codigoCbo || !nome) {
        invalid += 1;
        continue;
      }

      const existingByCode = await repository.findOneBy({ codigoCbo });
      const existingByName = existingByCode
        ? null
        : await repository.findOneBy({ nome });
      const existing = existingByCode ?? existingByName;

      if (!existing) {
        await repository.save(repository.create({ codigoCbo, nome }));
        inserted += 1;
        continue;
      }

      if (existing.codigoCbo !== codigoCbo || existing.nome !== nome) {
        existing.codigoCbo = codigoCbo;
        existing.nome = nome;
        await repository.save(existing);
        updated += 1;
      } else {
        ignored += 1;
      }
    }
  } finally {
    await dataSource.destroy();
  }

  console.log('Importacao CBO concluida.');
  console.log(`Novas: ${inserted}`);
  console.log(`Atualizadas: ${updated}`);
  console.log(`Ignoradas: ${ignored}`);
  console.log(`Invalidas: ${invalid}`);
}

function detectDelimiter(content: string) {
  const firstLine = content.split(/\r?\n/, 1)[0];
  return (firstLine.match(/;/g)?.length ?? 0) >
    (firstLine.match(/,/g)?.length ?? 0)
    ? ';'
    : ',';
}

function decodeCsv(buffer: Buffer) {
  const utf8 = buffer.toString('utf8');

  if (!utf8.includes('\uFFFD')) {
    return utf8;
  }

  return new TextDecoder('windows-1252').decode(buffer);
}

function normalizeHeader(header: string) {
  return header
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function findHeader(row: CsvRow, candidates: string[]) {
  return candidates.find((candidate) => candidate in row);
}

function normalizeCode(value?: string) {
  const digits = value?.replace(/\D/g, '') ?? '';

  if (digits.length !== 6) {
    return null;
  }

  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

function normalizeName(value?: string) {
  return value?.replace(/\s+/g, ' ').trim() || null;
}

void bootstrap().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
