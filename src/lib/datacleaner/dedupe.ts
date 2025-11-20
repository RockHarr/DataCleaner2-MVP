import type { Row } from '../../types';
export function dedupeByRut(rows: Row[]): { rows: Row[]; removed: number } {
  const m = new Map<string, Row>();
  for (const r of rows) {
    const rut = (r['rut'] ?? '').toString().trim();
    if (rut) m.set(rut, r); // mantiene la última aparición
  }
  const out = Array.from(m.values());
  return { rows: out, removed: rows.length - out.length };
}
