import { useState, useEffect, useMemo } from 'react';
import ExportBar from './components/project/ExportBar';
import UploadArea from './components/project/UploadArea';
import MappingTable from './components/project/MappingTable';
import SummaryPanel from './components/project/SummaryPanel';

import { consolidate } from './lib/datacleaner/consolidate';
import { cleanRows } from './lib/datacleaner/clean';
import { dedupeByRut } from './lib/datacleaner/dedupe';
import { exportCsv } from './lib/datacleaner/exportCsv';
import { saveMappings, loadMappings } from './services/schemaService';
import type { CleaningConfig, Row } from './types';

const TARGET_FIELDS = ['rut', 'nombres', 'region'] as const;
const PROJECT_ID = 'demo-project-123';

export default function App() {
  const [tables, setTables] = useState<Row[][]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [mapping, setMapping] = useState<
    Record<string, Record<string, string>>
  >({});
  const [dedupe, setDedupe] = useState(true);

  // 1) Al subir archivos, inicializa un mapeo vacío por archivo
  function onUploadSuccess(t: Row[][], f: File[]) {
    setTables(t);
    setFiles(f);
    const m: Record<string, Record<string, string>> = {};
    f.forEach((_, i) => {
      const headers = Object.keys(t[i]?.[0] ?? {});
      m[String(i)] = Object.fromEntries(headers.map((h) => [h, '']));
    });
    setMapping(m);
  }

  // 2) Consolidar + limpiar → matriz lista para exportar
  function buildCleanedMatrix() {
    const result = consolidate(
      files.map((f, i) => ({
        uploadId: String(i),
        name: f.name,
        rows: tables[i] ?? [],
      })),
      { fields: [...TARGET_FIELDS], mappings: mapping }
    );

    const config: CleaningConfig = {
      columnRules: [
        {
          column: 'rut',
          rules: ['trim', 'normalizeWhitespace', 'normalizeRut'],
        },
        {
          column: 'nombres',
          rules: ['trim', 'normalizeWhitespace', 'toTitleCase'],
        },
        // normalizeRegion ya maneja acentos + casos “V A L P A R A Í S O”
        {
          column: 'region',
          rules: ['trim', 'normalizeWhitespace', 'normalizeRegion'],
        },
      ],
    };

    const cleaned = cleanRows(result.rows, config);
    const headers = [...TARGET_FIELDS];
    const matrix = cleaned.rows.map((r) => headers.map((h) => r[h] ?? ''));
    return { headers, matrix };
  }

  // 3) Resumen derivado (totales, dedupe) para mostrar y reusar en export
  const summary = useMemo(() => {
    if (tables.length === 0) return null;

    const { headers, matrix } = buildCleanedMatrix();
    const total = matrix.length;

    const idx = {
      rut: headers.indexOf('rut'),
      nombres: headers.indexOf('nombres'),
      region: headers.indexOf('region'),
    };
    const asRows: Row[] = matrix.map((r) => ({
      rut: r[idx.rut] ?? '',
      nombres: r[idx.nombres] ?? '',
      region: r[idx.region] ?? '',
    }));
    const dd = dedupeByRut(asRows);

    return {
      headers,
      matrix,
      total,
      deduped: dd.rows.length,
      removed: total - dd.rows.length,
      dedupedRowsMatrix: dd.rows.map((r) => headers.map((h) => r[h] ?? '')),
    };
  }, [tables, files, mapping]);

  // 4) Persistencia de mapeos por proyecto
  useEffect(() => {
    const cached = loadMappings(PROJECT_ID);
    if (Object.keys(cached).length) setMapping(cached);
  }, []);

  useEffect(() => {
    if (Object.keys(mapping).length) saveMappings(PROJECT_ID, mapping);
  }, [mapping]);

  // 5) Evitar exportar si no hay mapeo útil
  const canExport = useMemo(() => {
    if (!summary) return false;
    const anyMapped = Object.values(mapping).some((m) =>
      Object.values(m).some((v) => v && v.length > 0)
    );
    return summary.total > 0 && anyMapped;
  }, [summary, mapping]);

  return (
    <div className="container">
      <h1 className="title">DataCleaner — MVP</h1>

      <div className="card">
        <h3>1) Subir CSV</h3>
        <UploadArea projectId="demo" onUploadSuccess={onUploadSuccess} />
        <div style={{ marginTop: 8, opacity: 0.8 }}>
          {files.length} archivo(s)
        </div>
      </div>

      {tables.length > 0 && (
        <div className="card">
          <h3>2) Definir mapeo</h3>
          <MappingTable
            files={files}
            tables={tables}
            targetFields={[...TARGET_FIELDS]}
            mapping={mapping}
            onChange={setMapping}
          />

          {summary && (
            <>
              <SummaryPanel
                total={summary.total}
                deduped={summary.deduped}
                removed={summary.removed}
              />

              <div
                style={{
                  marginTop: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <input
                  id="dd-rut"
                  type="checkbox"
                  checked={dedupe}
                  onChange={(e) => setDedupe(e.target.checked)}
                />
                <label htmlFor="dd-rut">Quitar duplicados por RUT</label>
              </div>

              <ExportBar
                disabled={!canExport}
                onExport={({ delimiter, excelCompat }) => {
                  const rowsForExport = dedupe
                    ? summary.dedupedRowsMatrix
                    : summary.matrix;

                  exportCsv(summary.headers, rowsForExport, 'consolidado.csv', {
                    delimiter,
                    crlf: excelCompat,
                  });
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
