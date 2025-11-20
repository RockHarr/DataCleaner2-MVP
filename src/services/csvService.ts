import Papa from 'papaparse';
import type { Row } from '../../types';

// Heurística simple: hay “mojibake” si aparecen estos patrones
const looksLikeMojibake = (s: string) =>
  /Ã.|Â.|Ã¢|Ã¤|Ã±|Ã³|Ã¡|Ãº|Ã­|\uFFFD/.test(s);

async function readAsText(file: File, encoding: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(fr.error);
    fr.onload = () => resolve(String(fr.result ?? ''));
    // @ts-ignore - el segundo parámetro es válido en browsers
    fr.readAsText(file, encoding);
  });
}

function parseCsvString(text: string): Row[] {
  const res = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  return (res.data as any[]).map((r) => {
    // normaliza cada celda a string NFC
    const out: Record<string, string> = {};
    for (const k in r) out[k] = String(r[k] ?? '').normalize('NFC');
    return out;
  });
}

export async function parseCsvFile(file: File): Promise<Row[]> {
  // 1) intenta UTF-8
  let text = (await readAsText(file, 'utf-8')) as string;

  // 2) si parece mojibake, reintenta en Windows-1252 (latin1)
  if (looksLikeMojibake(text)) {
    text = await readAsText(file, 'windows-1252');
  }

  // 3) normaliza todo a NFC (tildes correctas)
  text = text.normalize('NFC');

  return parseCsvString(text);
}
