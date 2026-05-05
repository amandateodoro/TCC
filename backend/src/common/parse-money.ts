export function parseMoney(value: string | number): string {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }

  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const parsed = Number(normalized);

  if (Number.isNaN(parsed)) {
    return '0.00';
  }

  return parsed.toFixed(2);
}
