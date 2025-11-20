import type {
  Row,
  CleaningConfig,
  CleaningResult,
  CleanRuleType,
} from '../../../types';
import { REGION_MAP } from '../../../constants';

// Colapsa secuencias tipo "V A L P A R A I S O" -> "VALPARAISO"
const collapseSpacedLetters = (s: string): string => {
  const t = s.trim();
  // si es del tipo L (espacios) L (espacios) ... L => quita espacios
  if (/^(?:\p{L}\s+)+\p{L}$/u.test(t)) return t.replace(/\s+/g, '');
  return s;
};

const toTitleCase = (s: string) =>
  s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase());
const removeAccents = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const calcDv = (num: string): string => {
  let sum = 0,
    mul = 2;
  for (let i = num.length - 1; i >= 0; i--) {
    sum += parseInt(num[i], 10) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const r = 11 - (sum % 11);
  return r === 11 ? '0' : r === 10 ? 'K' : String(r);
};
const normalizeRut = (raw: string): string => {
  const input = (raw ?? '').toString();
  let clean = input.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 2) return input;
  const body = clean.slice(0, -1),
    dv = clean.slice(-1);
  if (!/^\d+$/.test(body) || !/^[0-9K]$/.test(dv)) return input;
  const expected = calcDv(body);
  const useDv = dv; // cambia a expected si quieres forzar el DV correcto
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${useDv}`;
};
const normalizeRegion = (str: string): string => {
  // primero colapsa letras separadas
  const collapsed = collapseSpacedLetters(str);
  const cleanedStr = removeAccents(collapsed).trim().toUpperCase();

  // tu mapeo existente + Title Case + NFC
  return (REGION_MAP[cleanedStr] || toTitleCase(collapsed.trim())).normalize(
    'NFC'
  );
};

const applyRule = (value: unknown, rule: CleanRuleType): string => {
  let s = String(value ?? '').trim();
  switch (rule) {
    case 'trim':
      return s;
    case 'normalizeWhitespace':
      return s.replace(/\s+/g, ' ');
    case 'toUpper':
      return s.toUpperCase();
    case 'toLower':
      return s.toLowerCase();
    case 'toTitleCase':
      return toTitleCase(s);
    case 'removeAccents':
      return removeAccents(s);
    case 'normalizeRut':
      return normalizeRut(s);
    case 'normalizeRegion':
      return normalizeRegion(s);
    default:
      return s;
  }
};

export function cleanRows(rows: Row[], config: CleaningConfig): CleaningResult {
  const cleaned: Row[] = [];
  const columnsProcessed = config.columnRules.map((c) => c.column);

  for (const row of rows) {
    const out: Row = { ...row };
    for (const col of config.columnRules) {
      if (out[col.column] !== undefined) {
        let v: unknown = out[col.column];
        for (const rule of col.rules) v = applyRule(v, rule);
        out[col.column] = String(v ?? '');
      }
    }
    cleaned.push(out);
  }

  return {
    rows: cleaned,
    stats: {
      totalRows: rows.length,
      columnsProcessed: [...new Set(columnsProcessed)],
    },
  };
}
