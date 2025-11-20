import { useState } from 'react';
import { parseCsvFile } from '../../services/csvService';
import type { Row } from '../../../types';

export default function UploadArea({
  projectId,
  onUploadSuccess,
}: {
  projectId: string;
  onUploadSuccess: (tables: Row[][], files: File[]) => void;
}) {
  const [hover, setHover] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: File[]) {
    if (!files.length) return;
    setBusy(true);
    try {
      const parsed = await Promise.all(files.map(parseCsvFile));
      onUploadSuccess(parsed, files);
    } finally {
      setBusy(false);
    }
  }

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.currentTarget.files ?? []) as File[];
    handleFiles(files);
    e.currentTarget.value = '';
  }
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setHover(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    handleFiles(files);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={onDrop}
      className={`drop ${hover ? 'hover' : ''}`}
    >
      <p style={{ margin: 0 }}>
        <strong>Subir archivos CSV</strong>{' '}
        <small>(clic o arrástralos aquí)</small>
      </p>
      <input
        id="csv-input"
        type="file"
        accept=".csv,text/csv"
        multiple
        onChange={onInput}
        style={{ display: 'none' }}
      />
      <label
        htmlFor="csv-input"
        style={{
          textDecoration: 'underline',
          display: 'inline-block',
          marginTop: 12,
        }}
      >
        Elegir archivos…
      </label>
      {busy && <div style={{ marginTop: 10, opacity: 0.8 }}>Procesando…</div>}
    </div>
  );
}
