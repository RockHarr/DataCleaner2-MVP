import React from 'react';

type Props = {
  disabled?: boolean;
  onExport: (opts: { delimiter: ',' | ';'; excelCompat: boolean }) => void;
};

export default function ExportBar({ disabled, onExport }: Props) {
  const [delimiter, setDelimiter] = React.useState<',' | ';'>(';');
  const [excel, setExcel] = React.useState(true);

  return (
    <div
      style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}
    >
      <label>
        Separador:
        <select
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value as any)}
          style={{ marginLeft: 8 }}
        >
          <option value=";">;</option>
          <option value=",">,</option>
        </select>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input
          type="checkbox"
          checked={excel}
          onChange={(e) => setExcel(e.target.checked)}
        />
        Compatibilidad Excel (BOM+CRLF)
      </label>
      <button
        disabled={disabled}
        onClick={() => onExport({ delimiter, excelCompat: excel })}
      >
        Exportar CSV
      </button>
    </div>
  );
}
