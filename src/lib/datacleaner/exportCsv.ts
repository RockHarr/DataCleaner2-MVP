// src/lib/datacleaner/exportCsv.ts
type CsvOptions = { delimiter?: string; crlf?: boolean };

// overloads: permite 3 o 4 argumentos sin que TS se queje
export function exportCsv(headers: string[], rows: string[][]): void;
export function exportCsv(
  headers: string[],
  rows: string[][],
  filename: string
): void;
export function exportCsv(
  headers: string[],
  rows: string[][],
  filename: string,
  opts: CsvOptions
): void;

export function exportCsv(
  headers: string[],
  rows: string[][],
  filename = 'consolidado.csv',
  opts: CsvOptions = {}
) {
  const delim = opts.delimiter ?? ',';
  const eol = opts.crlf ? '\r\n' : '\n';

  const norm = (s: unknown) => String(s ?? '').normalize('NFC');
  const esc = (v: unknown) => `"${norm(v).replace(/"/g, '""')}"`;

  const lines = [
    headers.map(norm).join(delim),
    ...rows.map((r) => r.map(esc).join(delim)),
  ].join(eol);

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + lines], { type: 'text/csv;charset=utf-8;' });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
