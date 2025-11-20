import type { Row } from '../../../types';

export type Source = { uploadId: string; name: string; rows: Row[] };
export type TemplateSchema = {
  fields: string[];
  mappings: Record<string, Record<string, string>>;
};
export type ConsolidationResult = { fields: string[]; rows: Row[] };

export function consolidate(
  sources: Source[],
  template: TemplateSchema
): ConsolidationResult {
  const out: Row[] = [];
  for (const src of sources) {
    const map = template.mappings[src.uploadId] ?? {};
    for (const r of src.rows) {
      const nr: Row = {};
      for (const f of template.fields) {
        const original = Object.keys(map).find((k) => map[k] === f);
        nr[f] = original ? r[original] ?? '' : '';
      }
      out.push(nr);
    }
  }
  return { fields: template.fields, rows: out };
}
